const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
    res.locals.success = req.flash('success');
    res.redirect('doctor/dashboard');
  }catch(err){
    console.log(err)
  }
}