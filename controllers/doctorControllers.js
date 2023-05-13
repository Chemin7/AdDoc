const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const PDFDocument = require('pdfkit');
const fs = require('fs')
const path = require('path');




exports.getDashboardPage = async (req,res) => {

  let doctorId = req.user.id;

  let patients = await prisma.patient.findMany({ where: 
    { doctorId ,
      deleted:false
    } 
  });

  res.render('doctor/dashboard', { patients });
};


exports.getEditPatientPage = async (req,res) =>{
  try{
    const patient = await prisma.patient.findUnique(
      {
        where:{id:req.params.id}
      })
    res.render('doctor/edit-patient',{patient})
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
  res.render('doctor/')
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
    //symptoms : progress note
    const progressNote = await prisma.progressNote.create({
      data: {
        treatment,
        patientId,
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

    const filename = `${Date.now()}-${patient.name}.pdf`
  
     const dirPath = path.join(__dirname, '..', 'uploads', patient.doctorId, patient.id);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, filename);
    
    
     doc
      .fontSize(18)
      .text(`Patient Name: ${patientName}`, 100, 100)
      .text(`Doctor Name: ${doctorName}`, 100, 150)
      .text(`Doctor Email: ${doctorEmail}`, 100, 200)
      .text(`Date: ${Date(Date.now()).toString()}`, 100, 250)
      .text(`Treatment: ${treatment}`, 100, 300);

    doc.pipe(fs.createWriteStream(filePath))


    doc.end();
    
    req.flash('success', 'Prescription created correctly');
    res.redirect('/doctors/dashboard');
    
  }catch(err){
    console.log(err)
  }
}

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

















