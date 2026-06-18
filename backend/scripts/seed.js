const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const HealthRecord = require('../models/HealthRecord');
const Prescription = require('../models/Prescription');

dotenv.config({ path: '.env' });

const seedDB = async () => {
  try {
    console.log('[Seeding] Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/book-a-doctor');
    console.log('[Seeding] Connected! Dropping existing collections...');
    
    await User.deleteMany({});
    await Hospital.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await Appointment.deleteMany({});
    await HealthRecord.deleteMany({});
    await Prescription.deleteMany({});
    
    console.log('[Seeding] Hashing passwords...');
    const salt = await bcrypt.genSalt(10);
    const passPatient = await bcrypt.hash('patient123', salt);
    const passDoc = await bcrypt.hash('doctor123', salt);
    const passHosp = await bcrypt.hash('hospital123', salt);

    console.log('[Seeding] Creating user login records...');
    
    // Create Users
    const users = await User.insertMany([
      // Patients
      { username: 'rohan_patient', email: 'patient1@gmail.com', password: passPatient, role: 'patient' },
      
      // Legacy Doctors
      { username: 'dr_arvind_sharma', email: 'arvind.sharma@hospital.com', password: passDoc, role: 'doctor' },
      { username: 'dr_sneha_reddy', email: 'sneha.reddy@hospital.com', password: passDoc, role: 'doctor' },
      { username: 'dr_kabir_mehta', email: 'kabir.mehta@hospital.com', password: passDoc, role: 'doctor' },

      // National Doctors (Phase 1)
      { username: 'dr_amit_singh', email: 'amit.singh@aiims.com', password: passDoc, role: 'doctor' },
      { username: 'dr_rashmi_goel', email: 'rashmi.goel@fortis.com', password: passDoc, role: 'doctor' },
      { username: 'dr_sandeep_patil', email: 'sandeep.patil@kem.com', password: passDoc, role: 'doctor' },
      { username: 'dr_deepa_nair', email: 'deepa.nair@nimhans.com', password: passDoc, role: 'doctor' },
      { username: 'dr_vikram_hegde', email: 'vikram.hegde@narayana.com', password: passDoc, role: 'doctor' },
      { username: 'dr_srinivas_rao', email: 'srinivas.rao@kims.com', password: passDoc, role: 'doctor' },
      { username: 'dr_anjali_prasad', email: 'anjali.prasad@apollo.com', password: passDoc, role: 'doctor' },
      { username: 'dr_venkat_raman', email: 'venkat.raman@care.com', password: passDoc, role: 'doctor' },
      { username: 'dr_manian_k', email: 'manian.k@rajivgandhi.com', password: passDoc, role: 'doctor' },
      { username: 'dr_subrata_sen', email: 'subrata.sen@sskm.com', password: passDoc, role: 'doctor' },
      { username: 'dr_prakash_joshi', email: 'prakash.joshi@sassoon.com', password: passDoc, role: 'doctor' },
      { username: 'dr_bhavesh_patel', email: 'bhavesh.patel@civilahd.com', password: passDoc, role: 'doctor' },

      // National Doctors (Phase 2)
      { username: 'dr_manoj_gupta', email: 'manoj.gupta@sahara.com', password: passDoc, role: 'doctor' },
      { username: 'dr_harsh_vardhan', email: 'harsh.vardhan@fortisjaipur.com', password: passDoc, role: 'doctor' },
      { username: 'dr_shashi_kumar', email: 'shashi.kumar@paras.com', password: passDoc, role: 'doctor' },
      { username: 'dr_ritu_sharma', email: 'ritu.sharma@aiimsbhopal.com', password: passDoc, role: 'doctor' },
      { username: 'dr_gurpreet_singh', email: 'gurpreet.singh@fortischd.com', password: passDoc, role: 'doctor' },
      { username: 'dr_barua_baruah', email: 'baruah.b@gmch.org', password: passDoc, role: 'doctor' },
      { username: 'dr_thomas_mathew', email: 'thomas.mathew@aster.com', password: passDoc, role: 'doctor' },
      { username: 'dr_prasad_raju', email: 'prasad.raju@sevenhills.com', password: passDoc, role: 'doctor' },

      // Legacy Hospitals
      { username: 'metro_hosp_mumbai', email: 'contact@metromumbai.com', password: passHosp, role: 'hospital' },
      { username: 'green_valley_blr', email: 'admin@greenvalley.com', password: passHosp, role: 'hospital' },
      { username: 'apex_hosp_delhi', email: 'info@apexhealthcare.com', password: passHosp, role: 'hospital' },

      // National Hospitals (Phase 1)
      { username: 'aiims_delhi', email: 'contact@aiims.edu', password: passHosp, role: 'hospital' },
      { username: 'fortis_delhi', email: 'info@fortisescorts.in', password: passHosp, role: 'hospital' },
      { username: 'kem_mumbai', email: 'admin@kem.edu', password: passHosp, role: 'hospital' },
      { username: 'nimhans_blr', email: 'registrar@nimhans.ac.in', password: passHosp, role: 'hospital' },
      { username: 'narayana_blr', email: 'contact@narayanahealth.org', password: passHosp, role: 'hospital' },
      { username: 'nims_hyd', email: 'director@nims.edu.in', password: passHosp, role: 'hospital' },
      { username: 'care_hosp_hyd', email: 'contact@carehyderabad.com', password: passHosp, role: 'hospital' },
      { username: 'apollo_hosp_hyd', email: 'admin@apollohyderguda.com', password: passHosp, role: 'hospital' },
      { username: 'kims_hosp_hyd', email: 'info@kimshospitals.com', password: passHosp, role: 'hospital' },
      { username: 'rgggh_chennai', email: 'dean@rgggh.org', password: passHosp, role: 'hospital' },
      { username: 'apollo_chennai', email: 'greams@apollohospitals.com', password: passHosp, role: 'hospital' },
      { username: 'sskm_kolkata', email: 'principal@sskm.gov.in', password: passHosp, role: 'hospital' },
      { username: 'sassoon_pune', email: 'dean@sassoonpune.org', password: passHosp, role: 'hospital' },
      { username: 'civil_ahmedabad', email: 'info@civilhospitalahd.org', password: passHosp, role: 'hospital' },

      // National Hospitals (Phase 2)
      { username: 'sgpgi_lko', email: 'director@sgpgi.ac.in', password: passHosp, role: 'hospital' },
      { username: 'sahara_lko', email: 'contact@saharahospital.com', password: passHosp, role: 'hospital' },
      { username: 'sms_jaipur', email: 'admin@smshospital.in', password: passHosp, role: 'hospital' },
      { username: 'fortis_jaipur', email: 'jaipur@fortis.com', password: passHosp, role: 'hospital' },
      { username: 'pmch_patna', email: 'dean@pmch.in', password: passHosp, role: 'hospital' },
      { username: 'paras_patna', email: 'info@parashmri.com', password: passHosp, role: 'hospital' },
      { username: 'aiims_bhopal', email: 'info@aiimsbhopal.edu.in', password: passHosp, role: 'hospital' },
      { username: 'pgimer_chd', email: 'dean@pgimer.edu.in', password: passHosp, role: 'hospital' },
      { username: 'fortis_mohali', email: 'mohali@fortis.com', password: passHosp, role: 'hospital' },
      { username: 'gmch_guwahati', email: 'principal@gmchportal.in', password: passHosp, role: 'hospital' },
      { username: 'aster_kochi', email: 'kochi@asterhospital.com', password: passHosp, role: 'hospital' },
      { username: 'sevenhills_vizag', email: 'vizag@sevenhills.com', password: passHosp, role: 'hospital' },

      // Phase 3 State-wide District Expansion - Hospital Admins
      { username: 'ssg_vadodara', email: 'contact@ssgbh.in', password: passHosp, role: 'hospital' },
      { username: 'sterling_vadodara', email: 'info@sterlingvadodara.com', password: passHosp, role: 'hospital' },
      { username: 'myh_indore', email: 'admin@myhospital.in', password: passHosp, role: 'hospital' },
      { username: 'bombay_indore', email: 'info@bombayhospitalindore.com', password: passHosp, role: 'hospital' },
      { username: 'cmch_coimbatore', email: 'dean@cmchcoimbatore.org', password: passHosp, role: 'hospital' },
      { username: 'ramakrishna_coimbatore', email: 'contact@sriramakrishnahospital.com', password: passHosp, role: 'hospital' },
      { username: 'gmch_nagpur', email: 'registrar@gmchnagpur.gov.in', password: passHosp, role: 'hospital' },
      { username: 'kingsway_nagpur', email: 'info@kingswayhospitals.com', password: passHosp, role: 'hospital' },
      { username: 'aiims_bhubaneswar', email: 'admin@aiimsbhubaneswar.edu.in', password: passHosp, role: 'hospital' },
      { username: 'sum_bhubaneswar', email: 'info@sumultimatemedicare.com', password: passHosp, role: 'hospital' },
      { username: 'smimer_surat', email: 'dean@smimer.in', password: passHosp, role: 'hospital' },
      { username: 'sunshine_surat', email: 'contact@sunshinesurat.com', password: passHosp, role: 'hospital' },
      { username: 'skh_anand', email: 'info@charutarhealth.org', password: passHosp, role: 'hospital' },
      { username: 'csm_thane', email: 'dean@csmhospitalthane.org', password: passHosp, role: 'hospital' },
      { username: 'kdmc_kalyan', email: 'admin@kdmchospital.org', password: passHosp, role: 'hospital' },
      { username: 'kr_mysore', email: 'contact@mysoremedicalcollege.org', password: passHosp, role: 'hospital' },
      { username: 'kims_hubli', email: 'director@kimshubli.org', password: passHosp, role: 'hospital' },
      { username: 'mgm_warangal', email: 'superintendent@mgmwarangal.in', password: passHosp, role: 'hospital' },
      { username: 'ggh_vijayawada', email: 'admin@gghvijayawada.in', password: passHosp, role: 'hospital' },
      { username: 'rajaji_madurai', email: 'dean@grhmdr.org', password: passHosp, role: 'hospital' },
      { username: 'snmc_jodhpur', email: 'contact@snmcjodhpur.org', password: passHosp, role: 'hospital' },
      { username: 'jln_ajmer', email: 'dean@jlnmcajmer.org', password: passHosp, role: 'hospital' },
      { username: 'brd_gorakhpur', email: 'principal@brdmc.ac.in', password: passHosp, role: 'hospital' },
      { username: 'bhu_varanasi', email: 'director.ims@bhu.ac.in', password: passHosp, role: 'hospital' },
      { username: 'gmc_kozhikode', email: 'dean@gmckozhikode.gov.in', password: passHosp, role: 'hospital' },
      { username: 'gmc_thrissur', email: 'dean@gmcthrissur.gov.in', password: passHosp, role: 'hospital' },

      // Phase 3 State-wide District Expansion - Specialist Doctors
      { username: 'dr_patel_vad', email: 'amit.patel@ssg.in', password: passDoc, role: 'doctor' },
      { username: 'dr_vyas_ind', email: 'sanjay.vyas@myh.in', password: passDoc, role: 'doctor' },
      { username: 'dr_raj_cbt', email: 'rajesh.k@cmch.org', password: passDoc, role: 'doctor' },
      { username: 'dr_desh_nag', email: 'suresh.d@gmch.org', password: passDoc, role: 'doctor' },
      { username: 'dr_misra_bbs', email: 'alok.misra@aiims.edu.in', password: passDoc, role: 'doctor' },
      { username: 'dr_desai_srt', email: 'karan.desai@smimer.in', password: passDoc, role: 'doctor' },
      { username: 'dr_shah_and', email: 'anil.shah@skh.org', password: passDoc, role: 'doctor' },
      { username: 'dr_shinde_tha', email: 'rahul.shinde@csm.org', password: passDoc, role: 'doctor' },
      { username: 'dr_kulkarni_kln', email: 'vijay.k@kdmc.org', password: passDoc, role: 'doctor' },
      { username: 'dr_gowda_mys', email: 'chandra.g@kr.org', password: passDoc, role: 'doctor' },
      { username: 'dr_patil_hub', email: 'guru.patil@kims.org', password: passDoc, role: 'doctor' },
      { username: 'dr_chary_wgl', email: 'krishna.c@mgm.in', password: passDoc, role: 'doctor' },
      { username: 'dr_prasad_vjw', email: 'venkat.p@ggh.in', password: passDoc, role: 'doctor' },
      { username: 'dr_pandian_mdr', email: 'suresh.p@grh.org', password: passDoc, role: 'doctor' },
      { username: 'dr_rathore_jod', email: 'sunil.r@snmc.org', password: passDoc, role: 'doctor' },
      { username: 'dr_sharma_ajm', email: 'ajay.s@jln.org', password: passDoc, role: 'doctor' },
      { username: 'dr_mishra_gkp', email: 'devendra.m@brdmc.org', password: passDoc, role: 'doctor' },
      { username: 'dr_pandey_vns', email: 'anil.p@bhu.ac.in', password: passDoc, role: 'doctor' },
      { username: 'dr_nair_cal', email: 'pradeep.n@gmc.gov.in', password: passDoc, role: 'doctor' },
      { username: 'dr_menon_tcr', email: 'haridas.m@gmc.gov.in', password: passDoc, role: 'doctor' }
    ]);

    const uMap = {};
    users.forEach(u => { uMap[u.username] = u._id; });

    console.log('[Seeding] Creating hospital profiles...');

    // Create Hospitals
    const hospitals = await Hospital.insertMany([
      // MUMBAI
      {
        userId: uMap['metro_hosp_mumbai'],
        name: 'Metro City Multispecialty Hospital',
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=600&auto=format&fit=crop',
        address: 'Plot 42, Bandra Reclamation, Bandra West',
        city: 'Mumbai',
        coordinates: { lat: 19.0544, lng: 72.8294 },
        departments: ['Cardiology', 'Orthopedics', 'General Medicine', 'Neurology'],
        minPrice: 150,
        maxPrice: 600,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '022-26402222',
        rating: 4.6,
        reviews: [
          { patientName: 'Amit Shah', comment: 'Excellent and quick cardiac care.', rating: 5 }
        ]
      },
      {
        userId: uMap['kem_mumbai'],
        name: 'KEM Hospital & Research Centre',
        image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=600&auto=format&fit=crop',
        address: 'Acharya Donde Marg, Parel',
        city: 'Mumbai',
        coordinates: { lat: 19.0024, lng: 72.8421 },
        departments: ['General Medicine', 'Pediatrics', 'Cardiology', 'Orthopedics', 'Neurology'],
        minPrice: 0,
        maxPrice: 100,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan', 'CGHS'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '022-24107000',
        rating: 4.4,
        reviews: [
          { patientName: 'Suresh Patil', comment: 'Free treatment under Ayushman card. Highly helpful.', rating: 5 }
        ]
      },

      // BANGALORE
      {
        userId: uMap['green_valley_blr'],
        name: 'Green Valley General & Pediatric Hospital',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop',
        address: '12th Main Road, HAL 2nd Stage, Indiranagar',
        city: 'Bangalore',
        coordinates: { lat: 12.9719, lng: 77.5946 },
        departments: ['Pediatrics', 'General Medicine', 'Dermatology', 'Gynaecology'],
        minPrice: 250,
        maxPrice: 800,
        governmentSchemes: ['CGHS', 'Ayushman Bharat PM-JAY'],
        emergencyService: true,
        icuAvailable: false,
        bloodAvailable: true,
        ambulanceContact: '080-45129999',
        rating: 4.3,
        reviews: [
          { patientName: 'Karthik Raja', comment: 'Great doctors for kids. Very understanding.', rating: 5 }
        ]
      },
      {
        userId: uMap['nimhans_blr'],
        name: 'NIMHANS Neuro & Psychiatric Hospital',
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=600&auto=format&fit=crop',
        address: 'Hosur Road, Near Lakkasandra',
        city: 'Bangalore',
        coordinates: { lat: 12.9429, lng: 77.5975 },
        departments: ['Neurology', 'General Medicine'],
        minPrice: 50,
        maxPrice: 200,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'CGHS'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: false,
        ambulanceContact: '080-26995000',
        rating: 4.7,
        reviews: [
          { patientName: 'Harish Gowda', comment: 'Top class neurology treatment at subsidised costs.', rating: 5 }
        ]
      },
      {
        userId: uMap['narayana_blr'],
        name: 'Narayana Health City',
        image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=600&auto=format&fit=crop',
        address: '258/A, Bommasandra Industrial Area, Anekal',
        city: 'Bangalore',
        coordinates: { lat: 12.8123, lng: 77.6912 },
        departments: ['Cardiology', 'Orthopedics', 'Pediatrics', 'Neurology', 'General Medicine'],
        minPrice: 300,
        maxPrice: 1200,
        governmentSchemes: ['CGHS', 'Ayushman Bharat PM-JAY'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '080-22442255',
        rating: 4.6,
        reviews: [
          { patientName: 'Lakshmi Devi', comment: 'Cashless cardiac checkup done seamlessly.', rating: 5 }
        ]
      },

      // DELHI
      {
        userId: uMap['apex_hosp_delhi'],
        name: 'Apex Super Specialty Healthcare',
        image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=600&auto=format&fit=crop',
        address: 'Pusa Road, Opp. Metro Pillar 115, Karol Bagh',
        city: 'Delhi',
        coordinates: { lat: 28.6304, lng: 77.2177 },
        departments: ['Neurology', 'Orthopedics', 'Cardiology', 'Dermatology', 'General Medicine'],
        minPrice: 500,
        maxPrice: 1500,
        governmentSchemes: ['CGHS'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: false,
        ambulanceContact: '011-48228888',
        rating: 4.5,
        reviews: [
          { patientName: 'Sunita Sharma', comment: 'Highly professional neurologist.', rating: 5 }
        ]
      },
      {
        userId: uMap['aiims_delhi'],
        name: 'AIIMS (All India Institute of Medical Sciences)',
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=600&auto=format&fit=crop',
        address: 'Ansari Nagar, Ring Road',
        city: 'Delhi',
        coordinates: { lat: 28.5672, lng: 77.2100 },
        departments: ['Cardiology', 'Pediatrics', 'General Medicine', 'Neurology', 'Orthopedics'],
        minPrice: 0,
        maxPrice: 50,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'CGHS', 'State Low-Income Health Plan'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '011-26588500',
        rating: 4.8,
        reviews: [
          { patientName: 'Aman Yadav', comment: 'Best doctors in India. Cashless Ayushman coverage.', rating: 5 }
        ]
      },
      {
        userId: uMap['fortis_delhi'],
        name: 'Fortis Escorts Heart Institute',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop',
        address: 'Okhla Road, New Delhi',
        city: 'Delhi',
        coordinates: { lat: 28.5604, lng: 77.2735 },
        departments: ['Cardiology', 'Pediatrics', 'General Medicine'],
        minPrice: 400,
        maxPrice: 1200,
        governmentSchemes: ['CGHS', 'Ayushman Bharat PM-JAY'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '011-47135000',
        rating: 4.7,
        reviews: [
          { patientName: 'Neetu Goel', comment: 'Superb pediatric cardiology team.', rating: 5 }
        ]
      },

      // HYDERABAD
      {
        userId: uMap['care_hosp_hyd'],
        name: 'CARE Hospitals, Gachibowli',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop',
        address: 'Old Mumbai Highway, Near Westin Hotel, Gachibowli',
        city: 'Hyderabad',
        coordinates: { lat: 17.4424, lng: 78.3752 },
        departments: ['Pediatrics', 'Cardiology', 'General Medicine', 'Neurology', 'Orthopedics'],
        minPrice: 200,
        maxPrice: 600,
        governmentSchemes: ['CGHS', 'Ayushman Bharat PM-JAY'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '040-61111111',
        rating: 4.7,
        reviews: [
          { patientName: 'Nagesh Kumar', comment: 'Excellent pediatric emergency response and clean facilities.', rating: 5 }
        ]
      },
      {
        userId: uMap['apollo_hosp_hyd'],
        name: 'Apollo Hospitals, Hyderguda',
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=600&auto=format&fit=crop',
        address: 'Hyderguda, Near Old MLA Quarters',
        city: 'Hyderabad',
        coordinates: { lat: 17.3986, lng: 78.4822 },
        departments: ['Pediatrics', 'General Medicine', 'Cardiology', 'Neurology', 'Gynaecology'],
        minPrice: 150,
        maxPrice: 500,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'CGHS', 'State Low-Income Health Plan'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '040-23231380',
        rating: 4.8,
        reviews: [
          { patientName: 'Vijay Laxmi', comment: 'Prompt CGHS card approvals and expert pediatrician consultation.', rating: 5 }
        ]
      },
      {
        userId: uMap['kims_hosp_hyd'],
        name: 'KIMS Hospitals, Secunderabad',
        image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=600&auto=format&fit=crop',
        address: '1-8-31/1, Minister Road, Begumpet',
        city: 'Hyderabad',
        coordinates: { lat: 17.4334, lng: 78.4878 },
        departments: ['General Medicine', 'Pediatrics', 'Orthopedics', 'Cardiology', 'Neurology'],
        minPrice: 200,
        maxPrice: 800,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'CGHS'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: false,
        ambulanceContact: '040-44885000',
        rating: 4.5,
        reviews: [
          { patientName: 'Radha Mohan', comment: 'Very professional clinical environment and affordable rates.', rating: 4 }
        ]
      },
      {
        userId: uMap['nims_hyd'],
        name: 'NIMS (Nizam\'s Institute of Medical Sciences)',
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=600&auto=format&fit=crop',
        address: 'Panjagutta, Hyderabad',
        city: 'Hyderabad',
        coordinates: { lat: 17.4246, lng: 78.4520 },
        departments: ['Neurology', 'Cardiology', 'Orthopedics', 'General Medicine'],
        minPrice: 50,
        maxPrice: 250,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '040-23489000',
        rating: 4.3,
        reviews: [
          { patientName: 'Kiran Goud', comment: 'Government empanelled. Aarogyasri accepted.', rating: 4 }
        ]
      },

      // CHENNAI
      {
        userId: uMap['rgggh_chennai'],
        name: 'Rajiv Gandhi Government General Hospital',
        image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=600&auto=format&fit=crop',
        address: 'E.V.R. Periyar Salai, Park Town',
        city: 'Chennai',
        coordinates: { lat: 13.0805, lng: 80.2741 },
        departments: ['General Medicine', 'Pediatrics', 'Cardiology', 'Orthopedics'],
        minPrice: 0,
        maxPrice: 50,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '044-25305000',
        rating: 4.5,
        reviews: [
          { patientName: 'Murugan K', comment: 'Largest govt hospital. Free clinical care.', rating: 5 }
        ]
      },
      {
        userId: uMap['apollo_chennai'],
        name: 'Apollo Hospitals, Greams Road',
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=600&auto=format&fit=crop',
        address: '21, Greams Lane, Off Greams Road',
        city: 'Chennai',
        coordinates: { lat: 13.0601, lng: 80.2520 },
        departments: ['Cardiology', 'Pediatrics', 'General Medicine', 'Neurology', 'Orthopedics'],
        minPrice: 400,
        maxPrice: 1200,
        governmentSchemes: ['CGHS', 'Ayushman Bharat PM-JAY'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '044-28290200',
        rating: 4.8,
        reviews: [
          { patientName: 'Ramesh Krishnan', comment: 'Exceptional cardiologists.', rating: 5 }
        ]
      },

      // KOLKATA
      {
        userId: uMap['sskm_kolkata'],
        name: 'IPGMER and SSKM Hospital',
        image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=600&auto=format&fit=crop',
        address: '244, Acharya Jagadish Chandra Bose Road',
        city: 'Kolkata',
        coordinates: { lat: 22.5391, lng: 88.3444 },
        departments: ['General Medicine', 'Pediatrics', 'Cardiology', 'Orthopedics', 'Neurology'],
        minPrice: 0,
        maxPrice: 50,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '033-22231520',
        rating: 4.6,
        reviews: [
          { patientName: 'Joydip Das', comment: 'Cashless Swasthya Sathi treatment done.', rating: 5 }
        ]
      },

      // PUNE
      {
        userId: uMap['sassoon_pune'],
        name: 'Sassoon General Hospital',
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=600&auto=format&fit=crop',
        address: 'Station Road, Near Pune Railway Station',
        city: 'Pune',
        coordinates: { lat: 18.5276, lng: 73.8732 },
        departments: ['General Medicine', 'Pediatrics', 'Cardiology', 'Orthopedics'],
        minPrice: 0,
        maxPrice: 100,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '020-26128000',
        rating: 4.3,
        reviews: [
          { patientName: 'Anil Kulkarni', comment: 'Helpful doctors for basic pediatric care.', rating: 4 }
        ]
      },

      // AHMEDABAD
      {
        userId: uMap['civil_ahmedabad'],
        name: 'Civil Hospital, Ahmedabad',
        image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=600&auto=format&fit=crop',
        address: 'Asarwa, Near Haripura',
        city: 'Ahmedabad',
        coordinates: { lat: 23.0512, lng: 72.6025 },
        departments: ['General Medicine', 'Pediatrics', 'Cardiology', 'Orthopedics', 'Neurology'],
        minPrice: 0,
        maxPrice: 50,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan', 'CGHS'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '079-22683721',
        rating: 4.5,
        reviews: [
          { patientName: 'Mahesh Patel', comment: 'Very large campus. Free clinical support with PMJAY card.', rating: 5 }
        ]
      },

      // LUCKNOW
      {
        userId: uMap['sgpgi_lko'],
        name: 'SGPGIMS (Sanjay Gandhi Post Graduate Institute)',
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=600&auto=format&fit=crop',
        address: 'Raebareli Road, Lucknow',
        city: 'Lucknow',
        coordinates: { lat: 26.7423, lng: 80.9388 },
        departments: ['Cardiology', 'Neurology', 'Orthopedics', 'General Medicine'],
        minPrice: 50,
        maxPrice: 300,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'CGHS'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0522-2668004',
        rating: 4.6,
        reviews: [
          { patientName: 'Alok Gupta', comment: 'Top-class research institute and treatments.', rating: 5 }
        ]
      },
      {
        userId: uMap['sahara_lko'],
        name: 'Sahara Hospital, Lucknow',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop',
        address: 'Viraj Khand, Gomti Nagar',
        city: 'Lucknow',
        coordinates: { lat: 26.8524, lng: 81.0023 },
        departments: ['Pediatrics', 'General Medicine', 'Cardiology'],
        minPrice: 400,
        maxPrice: 800,
        governmentSchemes: ['CGHS', 'Ayushman Bharat PM-JAY'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0522-6780001',
        rating: 4.5,
        reviews: [
          { patientName: 'Sudha Singh', comment: 'Very professional pediatric care.', rating: 4 }
        ]
      },

      // JAIPUR
      {
        userId: uMap['sms_jaipur'],
        name: 'SMS Hospital (Sawai Man Singh)',
        image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=600&auto=format&fit=crop',
        address: 'Jawahar Lal Nehru Marg, Jaipur',
        city: 'Jaipur',
        coordinates: { lat: 26.9012, lng: 75.8155 },
        departments: ['General Medicine', 'Cardiology', 'Orthopedics', 'Neurology'],
        minPrice: 0,
        maxPrice: 50,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0141-2560291',
        rating: 4.4,
        reviews: [
          { patientName: 'Rajesh Sharma', comment: 'Huge state hospital, Chiranjeevi Yojana empanelled.', rating: 4 }
        ]
      },
      {
        userId: uMap['fortis_jaipur'],
        name: 'Fortis Escorts Hospital, Jaipur',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop',
        address: 'Jawaharlal Nehru Marg, Malviya Nagar',
        city: 'Jaipur',
        coordinates: { lat: 26.8488, lng: 75.8035 },
        departments: ['Pediatrics', 'Cardiology', 'General Medicine'],
        minPrice: 500,
        maxPrice: 1000,
        governmentSchemes: ['CGHS', 'Ayushman Bharat PM-JAY'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0141-2547000',
        rating: 4.7,
        reviews: [
          { patientName: 'Priya Meena', comment: 'Affordable child diagnostics and top pediatric specialists.', rating: 5 }
        ]
      },

      // PATNA
      {
        userId: uMap['pmch_patna'],
        name: 'PMCH (Patna Medical College and Hospital)',
        image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=600&auto=format&fit=crop',
        address: 'Ashok Rajpath, Patna',
        city: 'Patna',
        coordinates: { lat: 25.6201, lng: 85.1512 },
        departments: ['General Medicine', 'Pediatrics', 'Cardiology'],
        minPrice: 0,
        maxPrice: 30,
        governmentSchemes: ['Ayushman Bharat PM-JAY'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0612-2300341',
        rating: 4.1,
        reviews: [
          { patientName: 'Ravi Kumar', comment: 'Free treatment under government schemes.', rating: 4 }
        ]
      },
      {
        userId: uMap['paras_patna'],
        name: 'Paras HMRI Hospital, Patna',
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=600&auto=format&fit=crop',
        address: 'NH-30, Bailey Road, Raja Bazar',
        city: 'Patna',
        coordinates: { lat: 25.6111, lng: 85.0888 },
        departments: ['Pediatrics', 'Cardiology', 'General Medicine', 'Neurology'],
        minPrice: 400,
        maxPrice: 900,
        governmentSchemes: ['CGHS', 'Ayushman Bharat PM-JAY'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0612-7107777',
        rating: 4.5,
        reviews: [
          { patientName: 'Sanjana Kumari', comment: 'Experienced child specialist and good ICU care.', rating: 5 }
        ]
      },

      // BHOPAL
      {
        userId: uMap['aiims_bhopal'],
        name: 'AIIMS Bhopal',
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=600&auto=format&fit=crop',
        address: 'Saket Nagar, Bhopal',
        city: 'Bhopal',
        coordinates: { lat: 23.2045, lng: 77.4523 },
        departments: ['Cardiology', 'Pediatrics', 'General Medicine', 'Neurology', 'Orthopedics'],
        minPrice: 10,
        maxPrice: 100,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'CGHS'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0755-2900697',
        rating: 4.6,
        reviews: [
          { patientName: 'Deepak Raj', comment: 'Cashless PMJAY treatment. Very systematic.', rating: 5 }
        ]
      },

      // CHANDIGARH
      {
        userId: uMap['pgimer_chd'],
        name: 'PGIMER Chandigarh',
        image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=600&auto=format&fit=crop',
        address: 'Sector 12, Chandigarh',
        city: 'Chandigarh',
        coordinates: { lat: 30.7624, lng: 76.7766 },
        departments: ['Cardiology', 'Neurology', 'Orthopedics', 'General Medicine'],
        minPrice: 50,
        maxPrice: 200,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'CGHS'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0172-2747585',
        rating: 4.8,
        reviews: [
          { patientName: 'Harpal Singh', comment: 'World class doctors. Excellent government facility.', rating: 5 }
        ]
      },
      {
        userId: uMap['fortis_mohali'],
        name: 'Fortis Hospital, Mohali',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop',
        address: 'Sector 62, Phase VIII, Sahibzada Ajit Singh Nagar, Mohali',
        city: 'Chandigarh',
        coordinates: { lat: 30.6924, lng: 76.7323 },
        departments: ['Pediatrics', 'Cardiology', 'General Medicine', 'Orthopedics'],
        minPrice: 600,
        maxPrice: 1200,
        governmentSchemes: ['CGHS', 'Ayushman Bharat PM-JAY'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0172-5021222',
        rating: 4.7,
        reviews: [
          { patientName: 'Kiran Deep', comment: 'Best child cardiology facility in the region.', rating: 5 }
        ]
      },

      // GUWAHATI
      {
        userId: uMap['gmch_guwahati'],
        name: 'GMCH (Guwahati Medical College)',
        image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=600&auto=format&fit=crop',
        address: 'Indrapur, Bhangagarh, Guwahati',
        city: 'Guwahati',
        coordinates: { lat: 26.1524, lng: 91.7688 },
        departments: ['General Medicine', 'Pediatrics', 'Cardiology', 'Orthopedics'],
        minPrice: 0,
        maxPrice: 50,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0361-2134500',
        rating: 4.4,
        reviews: [
          { patientName: 'Baruah Gogoi', comment: 'Empanelled with Ayushman Asom scheme. Satisfactory care.', rating: 4 }
        ]
      },

      // KOCHI
      {
        userId: uMap['aster_kochi'],
        name: 'Aster Medcity, Kochi',
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=600&auto=format&fit=crop',
        address: 'Kuttisahib Road, Cheranalloor, Kochi',
        city: 'Kochi',
        coordinates: { lat: 10.0488, lng: 76.2735 },
        departments: ['Pediatrics', 'Cardiology', 'General Medicine', 'Neurology', 'Orthopedics'],
        minPrice: 500,
        maxPrice: 1200,
        governmentSchemes: ['CGHS', 'Ayushman Bharat PM-JAY'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0484-6699999',
        rating: 4.8,
        reviews: [
          { patientName: 'Mathew Thomas', comment: 'Extremely clean environment and very good pediatrics ward.', rating: 5 }
        ]
      },

      // VISAKHAPATNAM
      {
        userId: uMap['sevenhills_vizag'],
        name: 'SevenHills Hospital, Vizag',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop',
        address: 'Rockdale Layout, Ramnagar, Visakhapatnam',
        city: 'Visakhapatnam',
        coordinates: { lat: 17.7212, lng: 83.3033 },
        departments: ['Pediatrics', 'Cardiology', 'General Medicine', 'Neurology'],
        minPrice: 300,
        maxPrice: 800,
        governmentSchemes: ['CGHS', 'Ayushman Bharat PM-JAY'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0891-2708090',
        rating: 4.6,
        reviews: [
          { patientName: 'Prasad Raju', comment: 'Quick Aarogyasri approvals and good ICU ward support.', rating: 5 }
        ]
      },

      // VADODARA
      {
        userId: uMap['ssg_vadodara'],
        name: 'Sir Sayajirao General (SSG) Hospital',
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=600&auto=format&fit=crop',
        address: 'Jail Road (Indira Avenue), Vadodara',
        city: 'Vadodara',
        coordinates: { lat: 22.3072, lng: 73.1812 },
        departments: ['General Medicine', 'Cardiology', 'Pediatrics', 'Orthopedics', 'Neurology'],
        minPrice: 0,
        maxPrice: 50,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan', 'CGHS'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0265-2424424',
        rating: 4.4,
        reviews: [{ patientName: 'Nitin Patel', comment: 'Free treatment and good OPD services.', rating: 4 }]
      },
      {
        userId: uMap['sterling_vadodara'],
        name: 'Sterling Hospital, Vadodara',
        image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=600&auto=format&fit=crop',
        address: 'Near Akota Stadium, Vadodara',
        city: 'Vadodara',
        coordinates: { lat: 22.2929, lng: 73.1650 },
        departments: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine'],
        minPrice: 300,
        maxPrice: 900,
        governmentSchemes: ['CGHS', 'Ayushman Bharat PM-JAY'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0265-2354455',
        rating: 4.6,
        reviews: [{ patientName: 'Kirit Shah', comment: 'Highly clean and professional cardiology care.', rating: 5 }]
      },

      // INDORE
      {
        userId: uMap['myh_indore'],
        name: 'Maharaja Yeshwantrao Hospital (MYH)',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop',
        address: 'Residency Area, Indore',
        city: 'Indore',
        coordinates: { lat: 22.7196, lng: 75.8762 },
        departments: ['General Medicine', 'Cardiology', 'Pediatrics', 'Orthopedics'],
        minPrice: 0,
        maxPrice: 40,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0731-2527301',
        rating: 4.3,
        reviews: [{ patientName: 'Anoop Vyas', comment: 'Very cheap consulting and helpful staff.', rating: 4 }]
      },
      {
        userId: uMap['bombay_indore'],
        name: 'Bombay Hospital, Indore',
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=600&auto=format&fit=crop',
        address: 'Eastern Ring Road, Vijay Nagar, Indore',
        city: 'Indore',
        coordinates: { lat: 22.7533, lng: 75.8944 },
        departments: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine'],
        minPrice: 400,
        maxPrice: 1000,
        governmentSchemes: ['CGHS', 'Ayushman Bharat PM-JAY'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0731-2558866',
        rating: 4.7,
        reviews: [{ patientName: 'Ritu Jain', comment: 'Top class child specialist and modern rooms.', rating: 5 }]
      },

      // COIMBATORE
      {
        userId: uMap['cmch_coimbatore'],
        name: 'Coimbatore Medical College Hospital (CMCH)',
        image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=600&auto=format&fit=crop',
        address: 'Trichy Road, Gopalapuram, Coimbatore',
        city: 'Coimbatore',
        coordinates: { lat: 11.0022, lng: 76.9723 },
        departments: ['General Medicine', 'Pediatrics', 'Cardiology', 'Orthopedics'],
        minPrice: 0,
        maxPrice: 30,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0422-2301393',
        rating: 4.4,
        reviews: [{ patientName: 'Ramesh Kumar', comment: 'Largest public hospital in Coimbatore, free care.', rating: 5 }]
      },
      {
        userId: uMap['ramakrishna_coimbatore'],
        name: 'Sri Ramakrishna Hospital, Coimbatore',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop',
        address: 'Sarojini Naidu Road, Siddhapudur, Coimbatore',
        city: 'Coimbatore',
        coordinates: { lat: 11.0166, lng: 76.9699 },
        departments: ['Cardiology', 'Pediatrics', 'General Medicine', 'Neurology', 'Orthopedics'],
        minPrice: 300,
        maxPrice: 800,
        governmentSchemes: ['CGHS', 'Ayushman Bharat PM-JAY'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0422-4500000',
        rating: 4.7,
        reviews: [{ patientName: 'Sudha Pillai', comment: 'Excellent pediatric emergency ward and doctors.', rating: 5 }]
      },

      // NAGPUR
      {
        userId: uMap['gmch_nagpur'],
        name: 'Government Medical College (GMCH), Nagpur',
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=600&auto=format&fit=crop',
        address: 'Hanuman Nagar, Medical Square, Nagpur',
        city: 'Nagpur',
        coordinates: { lat: 21.1194, lng: 79.0975 },
        departments: ['General Medicine', 'Cardiology', 'Pediatrics', 'Orthopedics', 'Neurology'],
        minPrice: 0,
        maxPrice: 40,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0712-2744671',
        rating: 4.5,
        reviews: [{ patientName: 'Sanjay Deshmukh', comment: 'Very good public cardiology department.', rating: 4 }]
      },
      {
        userId: uMap['kingsway_nagpur'],
        name: 'Kingsway Hospital, Nagpur',
        image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=600&auto=format&fit=crop',
        address: 'Near Zero Mile, Nagpur',
        city: 'Nagpur',
        coordinates: { lat: 21.1511, lng: 79.0833 },
        departments: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine'],
        minPrice: 500,
        maxPrice: 1200,
        governmentSchemes: ['CGHS', 'Ayushman Bharat PM-JAY'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0712-6789100',
        rating: 4.8,
        reviews: [{ patientName: 'Vinod Agrawal', comment: 'Clean premises and top-notch critical care.', rating: 5 }]
      },

      // BHUBANESWAR
      {
        userId: uMap['aiims_bhubaneswar'],
        name: 'AIIMS Bhubaneswar',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop',
        address: 'Sijua, Patrapada, Bhubaneswar',
        city: 'Bhubaneswar',
        coordinates: { lat: 20.2450, lng: 85.7755 },
        departments: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine'],
        minPrice: 10,
        maxPrice: 100,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'CGHS'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0674-2476789',
        rating: 4.8,
        reviews: [{ patientName: 'Debendra Mohanty', comment: 'Superb treatment at very minimal costs.', rating: 5 }]
      },
      {
        userId: uMap['sum_bhubaneswar'],
        name: 'SUM Ultimate Medicare, Bhubaneswar',
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=600&auto=format&fit=crop',
        address: 'K-8, Kalinga Nagar, Bhubaneswar',
        city: 'Bhubaneswar',
        coordinates: { lat: 20.2911, lng: 85.7922 },
        departments: ['Cardiology', 'Pediatrics', 'General Medicine', 'Neurology', 'Orthopedics'],
        minPrice: 400,
        maxPrice: 1000,
        governmentSchemes: ['CGHS', 'Ayushman Bharat PM-JAY'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0674-2725555',
        rating: 4.7,
        reviews: [{ patientName: 'Tanmay Misra', comment: 'Best private infrastructure and child specialists.', rating: 5 }]
      },

      // SURAT
      {
        userId: uMap['smimer_surat'],
        name: 'SMIMER Hospital, Surat',
        image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=600&auto=format&fit=crop',
        address: 'Sahara Darwaja, Ring Road, Surat',
        city: 'Surat',
        coordinates: { lat: 21.1950, lng: 72.8450 },
        departments: ['General Medicine', 'Cardiology', 'Pediatrics', 'Orthopedics'],
        minPrice: 0,
        maxPrice: 50,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0261-2368040',
        rating: 4.4,
        reviews: [{ patientName: 'Bhavesh Desai', comment: 'Free operations under state low income card.', rating: 5 }]
      },
      {
        userId: uMap['sunshine_surat'],
        name: 'Sunshine Global Hospital, Surat',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop',
        address: 'Dumas Road, Piplod, Surat',
        city: 'Surat',
        coordinates: { lat: 21.1601, lng: 72.7812 },
        departments: ['Pediatrics', 'Cardiology', 'General Medicine', 'Orthopedics'],
        minPrice: 250,
        maxPrice: 700,
        governmentSchemes: ['CGHS', 'Ayushman Bharat PM-JAY'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0261-4089999',
        rating: 4.5,
        reviews: [{ patientName: 'Karan Shah', comment: 'Great doctors and support staff.', rating: 4 }]
      },

      // ANAND
      {
        userId: uMap['skh_anand'],
        name: 'Shree Krishna Hospital, Karamsad',
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=600&auto=format&fit=crop',
        address: 'Gokal Nagar, Karamsad, Anand',
        city: 'Anand',
        coordinates: { lat: 22.5401, lng: 72.8988 },
        departments: ['General Medicine', 'Cardiology', 'Pediatrics', 'Orthopedics', 'Neurology'],
        minPrice: 150,
        maxPrice: 600,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan', 'CGHS'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '02692-228411',
        rating: 4.6,
        reviews: [{ patientName: 'Amit Patel', comment: 'Charity trust hospital, highly affordable.', rating: 5 }]
      },

      // THANE
      {
        userId: uMap['csm_thane'],
        name: 'Chhatrapati Shivaji Maharaj Hospital, Kalwa',
        image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=600&auto=format&fit=crop',
        address: 'Kalwa, Thane, Maharashtra',
        city: 'Thane',
        coordinates: { lat: 19.2001, lng: 72.9902 },
        departments: ['General Medicine', 'Pediatrics', 'Cardiology', 'Orthopedics'],
        minPrice: 0,
        maxPrice: 50,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '022-25372624',
        rating: 4.3,
        reviews: [{ patientName: 'Rahul Shinde', comment: 'Government medical college hospital. Free care.', rating: 4 }]
      },

      // KALYAN
      {
        userId: uMap['kdmc_kalyan'],
        name: 'KDMC Hospital, Kalyan',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop',
        address: 'Rambaug, Kalyan, Maharashtra',
        city: 'Kalyan',
        coordinates: { lat: 19.2399, lng: 73.1311 },
        departments: ['General Medicine', 'Pediatrics', 'Orthopedics'],
        minPrice: 0,
        maxPrice: 50,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan'],
        emergencyService: true,
        icuAvailable: false,
        bloodAvailable: true,
        ambulanceContact: '0251-2200252',
        rating: 4.2,
        reviews: [{ patientName: 'Vijay Kulkarni', comment: 'Decent infrastructure and helpful general physician.', rating: 4 }]
      },

      // MYSORE
      {
        userId: uMap['kr_mysore'],
        name: 'KR Hospital (Mysore Medical College)',
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=600&auto=format&fit=crop',
        address: 'Irwin Road, Mysore',
        city: 'Mysore',
        coordinates: { lat: 12.3166, lng: 76.6500 },
        departments: ['General Medicine', 'Pediatrics', 'Cardiology', 'Orthopedics'],
        minPrice: 0,
        maxPrice: 40,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0821-2421074',
        rating: 4.4,
        reviews: [{ patientName: 'Chandra Gowda', comment: 'Mysores biggest government hospital, free child beds.', rating: 5 }]
      },

      // HUBLI
      {
        userId: uMap['kims_hubli'],
        name: 'KIMS Hubli',
        image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=600&auto=format&fit=crop',
        address: 'Vidyanagar, Hubli, Karnataka',
        city: 'Hubli',
        coordinates: { lat: 15.3647, lng: 75.1244 },
        departments: ['General Medicine', 'Pediatrics', 'Cardiology', 'Orthopedics', 'Neurology'],
        minPrice: 0,
        maxPrice: 50,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0836-2374624',
        rating: 4.5,
        reviews: [{ patientName: 'Basavaraj Patil', comment: 'Excellent neurology and critical care at low cost.', rating: 4 }]
      },

      // WARANGAL
      {
        userId: uMap['mgm_warangal'],
        name: 'MGM Hospital, Warangal',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop',
        address: 'MGM Road, Warangal, Telangana',
        city: 'Warangal',
        coordinates: { lat: 17.9689, lng: 79.5941 },
        departments: ['General Medicine', 'Pediatrics', 'Orthopedics'],
        minPrice: 0,
        maxPrice: 40,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0870-2441642',
        rating: 4.3,
        reviews: [{ patientName: 'Krishna Chary', comment: 'Helpful general medicine doctors and free scheme support.', rating: 4 }]
      },

      // VIJAYAWADA
      {
        userId: uMap['ggh_vijayawada'],
        name: 'GGH Vijayawada',
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=600&auto=format&fit=crop',
        address: 'Gopalareddy Road, Vijayawada',
        city: 'Vijayawada',
        coordinates: { lat: 16.5062, lng: 80.6480 },
        departments: ['General Medicine', 'Pediatrics', 'Cardiology', 'Orthopedics'],
        minPrice: 0,
        maxPrice: 40,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0866-2430033',
        rating: 4.4,
        reviews: [{ patientName: 'Nageswara Rao', comment: 'Aarogyasri card fully accepted. Good service.', rating: 5 }]
      },

      // MADURAI
      {
        userId: uMap['rajaji_madurai'],
        name: 'Government Rajaji Hospital, Madurai',
        image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=600&auto=format&fit=crop',
        address: 'Panagal Road, Madurai',
        city: 'Madurai',
        coordinates: { lat: 9.9252, lng: 78.1206 },
        departments: ['General Medicine', 'Pediatrics', 'Cardiology', 'Orthopedics'],
        minPrice: 0,
        maxPrice: 30,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0452-2532535',
        rating: 4.5,
        reviews: [{ patientName: 'Sundar Pandian', comment: 'Very busy but doctors are experts.', rating: 4 }]
      },

      // JODHPUR
      {
        userId: uMap['snmc_jodhpur'],
        name: 'SNMC Hospital, Jodhpur',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop',
        address: 'Shastri Nagar, Jodhpur',
        city: 'Jodhpur',
        coordinates: { lat: 26.2739, lng: 73.0243 },
        departments: ['General Medicine', 'Cardiology', 'Pediatrics', 'Orthopedics'],
        minPrice: 0,
        maxPrice: 50,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0291-2434381',
        rating: 4.4,
        reviews: [{ patientName: 'Sunil Rathore', comment: 'Chiranjeevi card fully active, free medicine.', rating: 4 }]
      },

      // AJMER
      {
        userId: uMap['jln_ajmer'],
        name: 'JLN Hospital, Ajmer',
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=600&auto=format&fit=crop',
        address: 'Naya Bazaar, Ajmer',
        city: 'Ajmer',
        coordinates: { lat: 26.4499, lng: 74.6399 },
        departments: ['General Medicine', 'Pediatrics', 'Orthopedics'],
        minPrice: 0,
        maxPrice: 40,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan'],
        emergencyService: true,
        icuAvailable: false,
        bloodAvailable: true,
        ambulanceContact: '0145-2443424',
        rating: 4.3,
        reviews: [{ patientName: 'Ajay Sharma', comment: 'Quick general consultation.', rating: 4 }]
      },

      // GORAKHPUR
      {
        userId: uMap['brd_gorakhpur'],
        name: 'BRD Medical College, Gorakhpur',
        image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=600&auto=format&fit=crop',
        address: 'Mughalpur, Gorakhpur',
        city: 'Gorakhpur',
        coordinates: { lat: 26.7606, lng: 83.3731 },
        departments: ['General Medicine', 'Pediatrics', 'Orthopedics'],
        minPrice: 0,
        maxPrice: 40,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0551-2501019',
        rating: 4.4,
        reviews: [{ patientName: 'Devendra Mishra', comment: 'Large pediatric wing and low price medicine.', rating: 5 }]
      },

      // VARANASI
      {
        userId: uMap['bhu_varanasi'],
        name: 'Sir Sunderlal Hospital BHU, Varanasi',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop',
        address: 'BHU Campus, Varanasi',
        city: 'Varanasi',
        coordinates: { lat: 25.2677, lng: 83.0012 },
        departments: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine'],
        minPrice: 10,
        maxPrice: 80,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'CGHS'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0542-2367568',
        rating: 4.7,
        reviews: [{ patientName: 'Anil Pandey', comment: 'Excellent cardiology unit at minimal pricing.', rating: 5 }]
      },

      // KOZHIKODE
      {
        userId: uMap['gmc_kozhikode'],
        name: 'Government Medical College, Kozhikode',
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=600&auto=format&fit=crop',
        address: 'Medical College Junction, Kozhikode',
        city: 'Kozhikode',
        coordinates: { lat: 11.2741, lng: 75.8372 },
        departments: ['General Medicine', 'Pediatrics', 'Cardiology', 'Orthopedics'],
        minPrice: 0,
        maxPrice: 50,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0495-2350212',
        rating: 4.6,
        reviews: [{ patientName: 'Pradeep Nair', comment: 'Highly popular and free state medical benefits.', rating: 5 }]
      },

      // THRISSUR
      {
        userId: uMap['gmc_thrissur'],
        name: 'Government Medical College, Thrissur',
        image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=600&auto=format&fit=crop',
        address: 'Mulankunnathukavu, Thrissur',
        city: 'Thrissur',
        coordinates: { lat: 10.6124, lng: 76.2024 },
        departments: ['General Medicine', 'Pediatrics', 'Orthopedics'],
        minPrice: 0,
        maxPrice: 50,
        governmentSchemes: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan'],
        emergencyService: true,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: '0487-2200310',
        rating: 4.5,
        reviews: [{ patientName: 'Haridas Menon', comment: 'Excellent pediatric team and affordable checkups.', rating: 4 }]
      }
    ]);

    const hMap = {};
    hospitals.forEach(h => { hMap[h.name] = h._id; });

    console.log('[Seeding] Creating doctor profiles...');

    // Create Doctors
    const doctors = await Doctor.insertMany([
      // Legacy Doctors
      {
        userId: uMap['dr_arvind_sharma'],
        hospitalId: hMap['Metro City Multispecialty Hospital'],
        name: 'Dr. Arvind Sharma',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
        specialization: 'Cardiology',
        experience: 15,
        consultationFee: 200,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '03:00 PM', '04:00 PM'],
        rating: 4.8
      },
      {
        userId: uMap['dr_sneha_reddy'],
        hospitalId: hMap['Green Valley General & Pediatric Hospital'],
        name: 'Dr. Sneha Reddy',
        photo: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 9,
        consultationFee: 300,
        availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
        availableTimeSlots: ['10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM'],
        rating: 4.7
      },
      {
        userId: uMap['dr_kabir_mehta'],
        hospitalId: hMap['Apex Super Specialty Healthcare'],
        name: 'Dr. Kabir Mehta',
        photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&auto=format&fit=crop',
        specialization: 'Neurology',
        experience: 12,
        consultationFee: 600,
        availableDays: ['Tuesday', 'Wednesday', 'Thursday'],
        availableTimeSlots: ['02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'],
        rating: 4.6
      },

      // National Doctors (Phase 1)
      {
        userId: uMap['dr_amit_singh'],
        hospitalId: hMap['AIIMS (All India Institute of Medical Sciences)'],
        name: 'Dr. Amit Singh',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
        specialization: 'Cardiology',
        experience: 14,
        consultationFee: 50,
        availableDays: ['Monday', 'Tuesday', 'Wednesday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'],
        rating: 4.8
      },
      {
        userId: uMap['dr_rashmi_goel'],
        hospitalId: hMap['Fortis Escorts Heart Institute'],
        name: 'Dr. Rashmi Goel',
        photo: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 11,
        consultationFee: 600,
        availableDays: ['Tuesday', 'Thursday', 'Friday'],
        availableTimeSlots: ['02:00 PM', '03:00 PM', '04:00 PM'],
        rating: 4.9
      },
      {
        userId: uMap['dr_sandeep_patil'],
        hospitalId: hMap['KEM Hospital & Research Centre'],
        name: 'Dr. Sandeep Patil',
        photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 10,
        consultationFee: 50,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableTimeSlots: ['10:00 AM', '11:00 AM', '12:00 PM'],
        rating: 4.7
      },
      {
        userId: uMap['dr_deepa_nair'],
        hospitalId: hMap['NIMHANS Neuro & Psychiatric Hospital'],
        name: 'Dr. Deepa Nair',
        photo: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=300&auto=format&fit=crop',
        specialization: 'Neurology',
        experience: 16,
        consultationFee: 100,
        availableDays: ['Monday', 'Tuesday', 'Thursday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'],
        rating: 4.9
      },
      {
        userId: uMap['dr_vikram_hegde'],
        hospitalId: hMap['Narayana Health City'],
        name: 'Dr. Vikram Hegde',
        photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop',
        specialization: 'Cardiology',
        experience: 15,
        consultationFee: 400,
        availableDays: ['Tuesday', 'Thursday', 'Saturday'],
        availableTimeSlots: ['02:00 PM', '03:00 PM', '04:00 PM'],
        rating: 4.8
      },
      {
        userId: uMap['dr_srinivas_rao'],
        hospitalId: hMap['KIMS Hospitals, Secunderabad'],
        name: 'Dr. Srinivas Rao',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 14,
        consultationFee: 300,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
        rating: 4.8
      },
      {
        userId: uMap['dr_anjali_prasad'],
        hospitalId: hMap['Apollo Hospitals, Hyderguda'],
        name: 'Dr. Anjali Prasad',
        photo: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 10,
        consultationFee: 250,
        availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
        availableTimeSlots: ['10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM'],
        rating: 4.7
      },
      {
        userId: uMap['dr_venkat_raman'],
        hospitalId: hMap['CARE Hospitals, Gachibowli'],
        name: 'Dr. Venkat Raman',
        photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop',
        specialization: 'Cardiology',
        experience: 18,
        consultationFee: 400,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '03:00 PM', '04:00 PM'],
        rating: 4.9
      },
      {
        userId: uMap['dr_manian_k'],
        hospitalId: hMap['Rajiv Gandhi Government General Hospital'],
        name: 'Dr. Manian K.',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 12,
        consultationFee: 30,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'],
        rating: 4.6
      },
      {
        userId: uMap['dr_subrata_sen'],
        hospitalId: hMap['IPGMER and SSKM Hospital'],
        name: 'Dr. Subrata Sen',
        photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 13,
        consultationFee: 50,
        availableDays: ['Tuesday', 'Thursday', 'Friday'],
        availableTimeSlots: ['10:00 AM', '11:00 AM', '12:00 PM'],
        rating: 4.7
      },
      {
        userId: uMap['dr_prakash_joshi'],
        hospitalId: hMap['Sassoon General Hospital'],
        name: 'Dr. Prakash Joshi',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 15,
        consultationFee: 50,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'],
        rating: 4.5
      },
      {
        userId: uMap['dr_bhavesh_patel'],
        hospitalId: hMap['Civil Hospital, Ahmedabad'],
        name: 'Dr. Bhavesh Patel',
        photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 11,
        consultationFee: 40,
        availableDays: ['Tuesday', 'Thursday', 'Saturday'],
        availableTimeSlots: ['10:00 AM', '11:00 AM', '02:00 PM'],
        rating: 4.7
      },

      // National Doctors (Phase 2)
      {
        userId: uMap['dr_manoj_gupta'],
        hospitalId: hMap['Sahara Hospital, Lucknow'],
        name: 'Dr. Manoj Gupta',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 12,
        consultationFee: 400,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '03:00 PM'],
        rating: 4.6
      },
      {
        userId: uMap['dr_harsh_vardhan'],
        hospitalId: hMap['Fortis Escorts Hospital, Jaipur'],
        name: 'Dr. Harsh Vardhan',
        photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 10,
        consultationFee: 500,
        availableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
        availableTimeSlots: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
        rating: 4.8
      },
      {
        userId: uMap['dr_shashi_kumar'],
        hospitalId: hMap['Paras HMRI Hospital, Patna'],
        name: 'Dr. Shashi Kumar',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 9,
        consultationFee: 300,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM'],
        rating: 4.5
      },
      {
        userId: uMap['dr_ritu_sharma'],
        hospitalId: hMap['AIIMS Bhopal'],
        name: 'Dr. Ritu Sharma',
        photo: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 11,
        consultationFee: 50,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableTimeSlots: ['10:00 AM', '11:00 AM', '12:00 PM'],
        rating: 4.7
      },
      {
        userId: uMap['dr_gurpreet_singh'],
        hospitalId: hMap['Fortis Hospital, Mohali'],
        name: 'Dr. Gurpreet Singh',
        photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 15,
        consultationFee: 600,
        availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM'],
        rating: 4.8
      },
      {
        userId: uMap['dr_barua_baruah'],
        hospitalId: hMap['GMCH (Guwahati Medical College)'],
        name: 'Dr. Barua Baruah',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 12,
        consultationFee: 30,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'],
        rating: 4.5
      },
      {
        userId: uMap['dr_thomas_mathew'],
        hospitalId: hMap['Aster Medcity, Kochi'],
        name: 'Dr. Thomas Mathew',
        photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 14,
        consultationFee: 500,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
        availableTimeSlots: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM'],
        rating: 4.8
      },
      {
        userId: uMap['dr_prasad_raju'],
        hospitalId: hMap['SevenHills Hospital, Vizag'],
        name: 'Dr. Prasad Raju',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 13,
        consultationFee: 400,
        availableDays: ['Tuesday', 'Thursday', 'Friday', 'Saturday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM'],
        rating: 4.7
      },

      // VADODARA
      {
        userId: uMap['dr_patel_vad'],
        hospitalId: hMap['Sir Sayajirao General (SSG) Hospital'],
        name: 'Dr. Amit Patel',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 12,
        consultationFee: 30,
        availableDays: ['Monday', 'Tuesday', 'Wednesday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'],
        rating: 4.6
      },
      {
        userId: uMap['dr_patel_vad'],
        hospitalId: hMap['Sterling Hospital, Vadodara'],
        name: 'Dr. Hiren Shah',
        photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop',
        specialization: 'Cardiology',
        experience: 15,
        consultationFee: 500,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableTimeSlots: ['10:00 AM', '11:00 AM', '02:00 PM'],
        rating: 4.8
      },

      // INDORE
      {
        userId: uMap['dr_vyas_ind'],
        hospitalId: hMap['Maharaja Yeshwantrao Hospital (MYH)'],
        name: 'Dr. Sanjay Vyas',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 14,
        consultationFee: 20,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'],
        rating: 4.5
      },

      // COIMBATORE
      {
        userId: uMap['dr_raj_cbt'],
        hospitalId: hMap['Coimbatore Medical College Hospital (CMCH)'],
        name: 'Dr. Rajesh K.',
        photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 11,
        consultationFee: 20,
        availableDays: ['Tuesday', 'Thursday', 'Saturday'],
        availableTimeSlots: ['10:00 AM', '11:00 AM', '12:00 PM'],
        rating: 4.7
      },

      // NAGPUR
      {
        userId: uMap['dr_desh_nag'],
        hospitalId: hMap['Government Medical College (GMCH), Nagpur'],
        name: 'Dr. Suresh Deshmukh',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
        specialization: 'Cardiology',
        experience: 18,
        consultationFee: 30,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'],
        rating: 4.7
      },

      // BHUBANESWAR
      {
        userId: uMap['dr_misra_bbs'],
        hospitalId: hMap['AIIMS Bhubaneswar'],
        name: 'Dr. Alok Misra',
        photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop',
        specialization: 'Cardiology',
        experience: 16,
        consultationFee: 50,
        availableDays: ['Monday', 'Tuesday', 'Thursday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'],
        rating: 4.8
      },

      // SURAT
      {
        userId: uMap['dr_desai_srt'],
        hospitalId: hMap['SMIMER Hospital, Surat'],
        name: 'Dr. Karan Desai',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 10,
        consultationFee: 30,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'],
        rating: 4.6
      },

      // ANAND
      {
        userId: uMap['dr_shah_and'],
        hospitalId: hMap['Shree Krishna Hospital, Karamsad'],
        name: 'Dr. Anil Shah',
        photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop',
        specialization: 'Cardiology',
        experience: 15,
        consultationFee: 200,
        availableDays: ['Tuesday', 'Thursday', 'Saturday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'],
        rating: 4.8
      },

      // THANE
      {
        userId: uMap['dr_shinde_tha'],
        hospitalId: hMap['Chhatrapati Shivaji Maharaj Hospital, Kalwa'],
        name: 'Dr. Rahul Shinde',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 12,
        consultationFee: 30,
        availableDays: ['Monday', 'Tuesday', 'Wednesday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'],
        rating: 4.5
      },

      // KALYAN
      {
        userId: uMap['dr_kulkarni_kln'],
        hospitalId: hMap['KDMC Hospital, Kalyan'],
        name: 'Dr. Vijay Kulkarni',
        photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 11,
        consultationFee: 25,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableTimeSlots: ['10:00 AM', '11:00 AM', '12:00 PM'],
        rating: 4.4
      },

      // MYSORE
      {
        userId: uMap['dr_gowda_mys'],
        hospitalId: hMap['KR Hospital (Mysore Medical College)'],
        name: 'Dr. Chandra Gowda',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 13,
        consultationFee: 30,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'],
        rating: 4.6
      },

      // HUBLI
      {
        userId: uMap['dr_patil_hub'],
        hospitalId: hMap['KIMS Hubli'],
        name: 'Dr. Guru Patil',
        photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 12,
        consultationFee: 30,
        availableDays: ['Monday', 'Tuesday', 'Wednesday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'],
        rating: 4.5
      },

      // WARANGAL
      {
        userId: uMap['dr_chary_wgl'],
        hospitalId: hMap['MGM Hospital, Warangal'],
        name: 'Dr. Krishna Chary',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 10,
        consultationFee: 20,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'],
        rating: 4.4
      },

      // VIJAYAWADA
      {
        userId: uMap['dr_prasad_vjw'],
        hospitalId: hMap['GGH Vijayawada'],
        name: 'Dr. Venkat Prasad',
        photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 12,
        consultationFee: 30,
        availableDays: ['Tuesday', 'Thursday', 'Saturday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'],
        rating: 4.5
      },

      // MADURAI
      {
        userId: uMap['dr_pandian_mdr'],
        hospitalId: hMap['Government Rajaji Hospital, Madurai'],
        name: 'Dr. Suresh Pandian',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 12,
        consultationFee: 20,
        availableDays: ['Monday', 'Tuesday', 'Wednesday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'],
        rating: 4.6
      },

      // JODHPUR
      {
        userId: uMap['dr_rathore_jod'],
        hospitalId: hMap['SNMC Hospital, Jodhpur'],
        name: 'Dr. Sunil Rathore',
        photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 14,
        consultationFee: 30,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'],
        rating: 4.5
      },

      // AJMER
      {
        userId: uMap['dr_sharma_ajm'],
        hospitalId: hMap['JLN Hospital, Ajmer'],
        name: 'Dr. Ajay Sharma',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 11,
        consultationFee: 20,
        availableDays: ['Monday', 'Tuesday', 'Wednesday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'],
        rating: 4.4
      },

      // GORAKHPUR
      {
        userId: uMap['dr_mishra_gkp'],
        hospitalId: hMap['BRD Medical College, Gorakhpur'],
        name: 'Dr. Devendra Mishra',
        photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 13,
        consultationFee: 25,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'],
        rating: 4.5
      },

      // VARANASI
      {
        userId: uMap['dr_pandey_vns'],
        hospitalId: hMap['Sir Sunderlal Hospital BHU, Varanasi'],
        name: 'Dr. Anil Pandey',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
        specialization: 'Cardiology',
        experience: 15,
        consultationFee: 40,
        availableDays: ['Tuesday', 'Thursday', 'Saturday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'],
        rating: 4.7
      },

      // KOZHIKODE
      {
        userId: uMap['dr_nair_cal'],
        hospitalId: hMap['Government Medical College, Kozhikode'],
        name: 'Dr. Pradeep Nair',
        photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 14,
        consultationFee: 30,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'],
        rating: 4.6
      },

      // THRISSUR
      {
        userId: uMap['dr_menon_tcr'],
        hospitalId: hMap['Government Medical College, Thrissur'],
        name: 'Dr. Haridas Menon',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
        specialization: 'Pediatrics',
        experience: 12,
        consultationFee: 30,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'],
        rating: 4.5
      }
    ]);

    const dMap = {};
    doctors.forEach(d => { dMap[d.name] = d._id; });

    console.log('[Seeding] Creating patient profile...');

    // Create Patient
    const patient = new Patient({
      userId: uMap['rohan_patient'],
      name: 'Rohan Verma',
      age: 32,
      gender: 'Male',
      phone: '9876543210',
      location: 'Mumbai',
      incomeRange: 'low',
      healthProblem: 'Chest discomfort and shortness of breath during walk',
      insuranceDetails: 'State Low Income Scheme Card',
      abhaId: '91-2083-4859-1039',
      governmentSchemesEligible: ['Ayushman Bharat PM-JAY', 'State Low-Income Health Plan']
    });
    await patient.save();

    console.log('[Seeding] Creating initial bookings, files & prescriptions...');

    // Create Appointment
    const appointment = new Appointment({
      appointmentId: 'BAD-2026-7789',
      patientId: patient._id,
      doctorId: dMap['Dr. Arvind Sharma'],
      hospitalId: hMap['Metro City Multispecialty Hospital'],
      date: new Date('2026-05-22'),
      timeSlot: '10:00 AM',
      reason: 'Regular heart review checkup',
      status: 'confirmed',
      notes: 'Patient should carry previous reports.'
    });
    await appointment.save();

    // Create HealthRecord
    const record = new HealthRecord({
      patientId: patient._id,
      title: 'ECG Report Jan 2026',
      type: 'report',
      fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKJ...',
      notes: 'Slightly high heart rate observed during running.'
    });
    await record.save();

    // Create Prescription
    const prescription = new Prescription({
      appointmentId: appointment._id,
      patientId: patient._id,
      doctorId: dMap['Dr. Arvind Sharma'],
      medicines: [
        { name: 'Atenolol', dosage: '25mg', frequency: 'Once daily (Morning)', duration: '30 Days' },
        { name: 'Ecosprin', dosage: '75mg', frequency: 'Once daily (Night)', duration: '30 Days' }
      ],
      advice: 'Avoid oily and spicy foods. Do light morning walking for 20 minutes.'
    });
    await prescription.save();

    console.log('\x1b[32m[Seeding SUCCESS] Seeded successfully!\x1b[0m');
    mongoose.connection.close();
  } catch (error) {
    console.error('\x1b[31m[Seeding ERROR]\x1b[0m', error.message);
    mongoose.connection.close();
  }
};

seedDB();
