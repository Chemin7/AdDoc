const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getDashboardPage = async (req,res) => {

  let doctorId = req.user.id;
  const symptoms = await prisma.symptom.findMany();

  let patients = await prisma.patient.findMany({ where: { doctorId } });

  // Pass patients to the view
  res.render('doctor/dashboard', { patients,symptoms });
};


exports.getEditPatientPage = async (req,res) =>{
  try{
    const symptoms = await prisma.symptom.findMany();
    const patient = await prisma.patient.findUnique(
      {
        where:{id:req.params.id}
      })
    res.render('doctor/edit-patient',{patient,symptoms})
  }catch(err){
    console.log(err)
  }
  
}

//API
exports.registerPatient = async (req, res) => {
  const { name, email, age, gender, address, phoneNumber, religion } = req.body;

  try {
    // Get the doctor's ID from req.user
    const doctorId = req.user.id;

    // Check if doctor exists
    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) {
      return res.status(400).json({ msg: 'Doctor not found' });
    }

    // Check if patient already exists
    const existingPatient = await prisma.patient.findUnique({ where: { email } });
    if (existingPatient) {
      return res.status(400).json({ msg: 'Patient already exists' });
    }

    // Create a new patient and associate it with the doctor
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
