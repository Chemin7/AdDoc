const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const PDFDocument = require('pdfkit');
const fs = require('fs')
const path = require('path');
const { type } = require('os');




exports.getDashboardPage = async (req,res) => {

  let doctorId = req.user.id;
  const formData = req.flash('formData')[0];
  let patients = await prisma.patient.findMany({ where: 
    { doctorId ,
      deleted:false
    } 
  });

  res.render('doctor/dashboard', { patients,formData });
};


exports.getEditPatientPage = async (req,res) =>{
  try{
    const formData = await prisma.patient.findUnique(
      {
        where:{id:req.params.id}
      })
    res.render('doctor/edit-patient',{formData})
  }catch(err){
    console.log(err)
  }
  
}


exports.getGenerateRecipePage = async (req,res)=>{
  try{
    const symptoms = await prisma.symptom.findMany()
    const patient = await prisma.patient.findUnique(
      {
        where:{id:req.params.id}
      })
    res.render('doctor/recipe',{symptoms,patient})
  }catch(err){
    console.log(err);
  }
}

exports.getPrescriptionRecordPage = async(req,res)=>{
  const {patientId} = req.params
  console.log(patientId)
  try{
    const {name} = await prisma.patient.findUnique({
      where:{
        id:patientId
      },
      select:{
        name:true
      }
    })
    const progressNotes = await prisma.progressNote.findMany({
      where:{
        patientId
      },
      select:{
        id:true,
        date:true,
      },
     
      
    })

    res.render('doctor/prescription-record',{progressNotes,patientId,name})
  }catch(err){
    console.log(err)
  }

 
}
//API
exports.registerPatient = async (req, res) => {
  const { name, email, age, gender, address, phoneNumber, religion } = req.body;

  try {

    const doctorId = req.user.id;


    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) {
      return res.status(400).json({ msg: 'Doctor not found' });
    }

  
    const existingPatient = await prisma.patient.findUnique({ where: { email } });
    if (existingPatient) {
      return res.status(400).json({ msg: 'Patient already exists' });
    }

    const patient = await prisma.patient.create({
      data: {
        name,
        email,
        age: parseInt(age),
        gender,
        address,
        phoneNumber,
        religion,
        doctorId
      },
    });
    req.flash('success','Patient registered successfully');
    res.redirect('/doctors/dashboard');

  } catch (error) {
    console.error('Error registering patient:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

exports.editPatient = async (req,res) =>{
  const {id} = req.params;
  const {age,...restOfBody} = req.body;
 
  try {
    const updatedPatient = await prisma.patient.update({
      where: { id },
      data: { 
        age: parseInt(age),
       ...restOfBody 
      },
    });

  req.flash('success','Patient successfully updated')
  res.redirect('/doctors/dashboard')

  } catch (error) {
    console.log(error);
    return res.redirect('/error');
  }
  
}

exports.softDeletePatient = async (req,res) => {
  
  try{
    const patientId = req.params.id;
    console.log(patientId)
    await prisma.patient.update({
      where:{
        id:patientId
      },
      data:{
        deleted:true
      }
    });

    req.flash('success', 'Patient deleted correctly');
    res.redirect('doctor/dashboard');
  }catch(err){
    console.log(err)
  }
}




exports.createPrescription = async (req, res) => {
  const { patientId } = req.params;
  const { treatment,symptoms } = req.body;
  console.log(symptoms)
  console.log(typeof(symptoms))
  try {
    

    //prescription

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: { Doctor: true },
    });

    if (!patient) {
      throw new Error('Patient not found');
    }

    const { name: patientName } = patient;
    const { name: doctorName, email: doctorEmail ,id:doctorId} = patient.Doctor;

    // Create a new PDF document

    const doc = new PDFDocument();

    const fileName = `${Date.now()}-${patient.name}.pdf`
  
     const dirPath = path.join(__dirname, '..', 'uploads', patient.doctorId, patient.id);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, fileName);
    
    const date = new Date(Date.now())
    const dateString = Date.now().toString()
    const dateOtra = new Date(date.getFullYear(), date.getMonth(),date.getDay())

    console.log(date)
    console.log(dateString)
    console.log(dateOtra)
     doc
      .fontSize(18)
      .text(`Patient Name: ${patientName}`, 100, 100)
      .text(`Doctor Name: ${doctorName}`, 100, 150)
      .text(`Doctor Email: ${doctorEmail}`, 100, 200)
      .text(`Date: ${dateString}`, 100, 250)
      .text(`Treatment: ${treatment}`, 100, 300);

    doc.pipe(fs.createWriteStream(filePath))


    doc.end();

    //symptoms : progress note
    console.log(typeof(date) , " date")
    console.log(typeof(Date(date)), " Date(date)")
    const progressNote = await prisma.progressNote.create({
      data: {
        treatment,
        patientId,
        fileName,
        date,
      },
    });

    for (let i = 0; i < symptoms.length; i++) {
      await prisma.progressNoteOnSymptom.create({
        data: {
          progressNoteId: progressNote.id,
          symptomId: symptoms[i],
        },
      });
    }

    
    req.flash('success', 'Prescription created correctly');
    res.redirect('/doctors/dashboard');
    
  }catch(err){
    console.log(err)
  }
}
/*
exports.getPrescriptionRecord = async (req,res)=>{
  const {patientId} = req.params
  try{
    const prescriptions = await prisma.progressNote.findMany({
      where:{
        patientId
      }
    })

    res.json(prescriptions);
  }catch(err){
    console.log(err);
  }
}
*/
exports.getPatientPrescription = async (req, res, next) => {
  try {
    const {progressNoteId,patientId} = req.params;
    const {fileName} = await prisma.progressNote.findUnique({
      where:{
       id:progressNoteId 
      },
      select:{
        fileName:true,
      }
    })

    console.log(`
      req.user.id = ${req.user.id} \n
      patientId =${patientId} \n
      filename = ${fileName}
    `)
    const filePath = path.join(__dirname, '..', 'uploads',req.user.id, patientId, fileName); 

    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send('Prescription not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in obtaining patient's prescription");
  }
};

exports.deletePatientPrescription = async (req, res) => {
  try {
    const { progressNoteId, patientId } = req.params;

    // Fetch the progress note and its file name
    const progressNote = await prisma.progressNote.findUnique({
      where: {
        id: progressNoteId,
      },
      select: {
        fileName: true,
      },
    });

    // Delete the progress note symptom associations
    await prisma.progressNoteOnSymptom.deleteMany({
      where: {
        progressNoteId,
      },
    });

    // Delete the progress note
    await prisma.progressNote.delete({
      where: {
        id: progressNoteId,
      },
    });

    // Delete the file
    const filePath = path.join(__dirname, '..', 'uploads', req.user.id, patientId, progressNote.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    req.flash('success', 'Prescription deleted correctly');
    res.redirect(`/doctors/record/${patientId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error in deleting the prescription');
  }
};















