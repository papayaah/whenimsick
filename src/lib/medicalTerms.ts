// Medical terms dictionary for tooltips
export const MEDICAL_TERMS: Record<string, string> = {
  // Respiratory terms
  'rhinorrhea': 'A runny nose - excessive nasal discharge or mucus from the nose.',
  'rhinitis': 'Inflammation of the nasal passages, often causing congestion and sneezing.',
  'pharyngitis': 'Inflammation of the pharynx (throat), commonly known as a sore throat.',
  'laryngitis': 'Inflammation of the larynx (voice box), often causing hoarseness or loss of voice.',
  'bronchitis': 'Inflammation of the bronchial tubes, the airways that carry air to your lungs.',
  'pneumonia': 'Infection that inflames air sacs in one or both lungs, which may fill with fluid.',
  'asthma': 'A chronic respiratory condition causing difficulty breathing due to narrowed airways.',
  'dyspnea': 'Shortness of breath or difficulty breathing.',
  'tachypnea': 'Abnormally rapid breathing.',
  'wheezing': 'A high-pitched whistling sound made while breathing, often due to narrowed airways.',
  'stridor': 'A harsh, vibrating sound when breathing, usually indicating airway obstruction.',
  'rales': 'Crackling sounds heard in the lungs, often indicating fluid or infection.',
  'rhonchi': 'Low-pitched sounds heard in the lungs, often due to mucus or fluid.',
  
  // Gastrointestinal terms
  'nausea': 'A feeling of sickness with an inclination to vomit.',
  'emesis': 'The medical term for vomiting.',
  'diarrhea': 'Frequent, loose, or watery bowel movements.',
  'constipation': 'Difficulty in emptying the bowels, usually associated with hardened feces.',
  'dyspepsia': 'Indigestion or upset stomach.',
  'gastritis': 'Inflammation of the stomach lining.',
  'gastroenteritis': 'Inflammation of the stomach and intestines, often causing diarrhea and vomiting.',
  'reflux': 'Backward flow of stomach acid into the esophagus, causing heartburn.',
  'dysphagia': 'Difficulty swallowing.',
  'anorexia': 'Loss of appetite or reduced desire to eat.',
  'cachexia': 'Weight loss and muscle wasting due to chronic illness.',
  
  // Neurological terms
  'migraine': 'A severe headache often accompanied by nausea, vomiting, and sensitivity to light.',
  'cephalgia': 'The medical term for headache.',
  'vertigo': 'A sensation of spinning or dizziness.',
  'syncope': 'Temporary loss of consciousness, commonly known as fainting.',
  'paresthesia': 'Abnormal sensations like tingling, prickling, or numbness.',
  'ataxia': 'Lack of muscle coordination, affecting speech, eye movements, and swallowing.',
  'meningitis': 'Inflammation of the membranes surrounding the brain and spinal cord.',
  'encephalitis': 'Inflammation of the brain tissue.',
  
  // Cardiovascular terms
  'tachycardia': 'Abnormally fast heart rate (over 100 beats per minute).',
  'bradycardia': 'Abnormally slow heart rate (under 60 beats per minute).',
  'arrhythmia': 'Irregular heart rhythm.',
  'hypertension': 'High blood pressure.',
  'hypotension': 'Low blood pressure.',
  'palpitations': 'Awareness of your own heartbeat, often described as fluttering or pounding.',
  'angina': 'Chest pain caused by reduced blood flow to the heart muscle.',
  'myocardial infarction': 'Heart attack - damage to heart muscle due to blocked blood flow.',
  
  // Musculoskeletal terms
  'arthralgia': 'Joint pain.',
  'myalgia': 'Muscle pain.',
  'fibromyalgia': 'A condition causing widespread muscle pain and tenderness.',
  'arthritis': 'Inflammation of one or more joints.',
  'osteoporosis': 'A condition where bones become weak and brittle.',
  'bursitis': 'Inflammation of the fluid-filled sacs that cushion joints.',
  'tendinitis': 'Inflammation of a tendon.',
  'sprain': 'Stretching or tearing of ligaments.',
  'strain': 'Stretching or tearing of muscles or tendons.',
  
  // Dermatological terms
  'pruritus': 'The medical term for itching.',
  'urticaria': 'Hives - raised, itchy welts on the skin.',
  'eczema': 'A condition that makes skin red and itchy.',
  'dermatitis': 'Inflammation of the skin.',
  'rash': 'A change in skin color, texture, or appearance.',
  'erythema': 'Redness of the skin caused by increased blood flow.',
  'edema': 'Swelling caused by excess fluid trapped in body tissues.',
  'cellulitis': 'A bacterial skin infection that can spread to underlying tissues.',
  
  // General medical terms
  'febrile': 'Having a fever.',
  'afebrile': 'Not having a fever.',
  'malaise': 'A general feeling of discomfort, illness, or uneasiness.',
  'fatigue': 'Extreme tiredness or lack of energy.',
  'lethargy': 'A state of sluggishness, inactivity, and apathy.',
  'anemia': 'A condition where you lack enough healthy red blood cells.',
  'dehydration': 'A condition that occurs when you lose more fluid than you take in.',
  'inflammation': 'The body\'s response to injury or infection, causing redness, swelling, and pain.',
  'infection': 'The invasion and multiplication of microorganisms in body tissues.',
  'sepsis': 'A life-threatening condition caused by the body\'s response to an infection.',
  'immunocompromised': 'Having a weakened immune system.',
  'contraindication': 'A condition that makes a particular treatment or procedure inadvisable.',
  'prognosis': 'The likely course or outcome of a disease or condition.',
  'etiology': 'The cause or origin of a disease.',
  'pathology': 'The study of disease and its causes.',
  'symptomatology': 'The set of symptoms characteristic of a medical condition.',
  'differential diagnosis': 'The process of distinguishing between two or more conditions with similar symptoms.',
  'acute': 'Having a sudden onset and short duration.',
  'chronic': 'Persisting for a long time or constantly recurring.',
  'subacute': 'Between acute and chronic in duration.',
  'remission': 'A period when symptoms of a disease are reduced or disappear.',
  'relapse': 'The return of a disease or symptoms after a period of improvement.',
  'comorbidity': 'The presence of two or more medical conditions in a patient.',
  'iatrogenic': 'Caused by medical treatment or procedures.',
  'idiopathic': 'A disease or condition of unknown cause.',
  
  // Medication and treatment terms
  'analgesic': 'A medication that relieves pain.',
  'antipyretic': 'A medication that reduces fever.',
  'anti-inflammatory': 'A medication that reduces inflammation.',
  'antibiotic': 'A medication that fights bacterial infections.',
  'antiviral': 'A medication that fights viral infections.',
  'antihistamine': 'A medication that blocks histamine, often used for allergies.',
  'decongestant': 'A medication that reduces nasal congestion.',
  'expectorant': 'A medication that helps clear mucus from the airways.',
  'prophylaxis': 'Treatment given to prevent disease.',
  'contraindicated': 'Not recommended due to potential harm.',
  'dosage': 'The amount of medication to be taken.',
  'administration': 'The way a medication is given (oral, injection, etc.).',
  
  // Diagnostic terms
  'diagnosis': 'The identification of a disease or condition.',
  'screening': 'Testing for a disease in people who have no symptoms.',
  'biopsy': 'The removal of a small sample of tissue for examination.',
  'imaging': 'Medical tests that create pictures of the inside of the body.',
  'laboratory tests': 'Tests performed on blood, urine, or other body fluids.',
  'vital signs': 'Basic body functions including temperature, pulse, breathing rate, and blood pressure.',
  'auscultation': 'Listening to sounds within the body, usually with a stethoscope.',
  'palpation': 'Examination by touch.',
  'percussion': 'Tapping on the body to assess underlying structures.',
  
  // Body systems
  'respiratory system': 'The organs and tissues involved in breathing.',
  'cardiovascular system': 'The heart and blood vessels.',
  'gastrointestinal system': 'The digestive tract from mouth to anus.',
  'nervous system': 'The brain, spinal cord, and nerves.',
  'immune system': 'The body\'s defense against infections and diseases.',
  'endocrine system': 'Glands that produce hormones.',
  'musculoskeletal system': 'Bones, muscles, and connective tissues.',
  'integumentary system': 'The skin and its appendages.',
  'urinary system': 'The kidneys, bladder, and related structures.',
  'reproductive system': 'Organs involved in reproduction.',
};

// Function to detect medical terms in text
export function detectMedicalTerms(text: string): string[] {
  const foundTerms: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const term of Object.keys(MEDICAL_TERMS)) {
    if (lowerText.includes(term.toLowerCase())) {
      foundTerms.push(term);
    }
  }
  
  return foundTerms;
}

// Function to wrap medical terms in tooltip components
export function wrapMedicalTerms(text: string): string {
  let wrappedText = text;
  
  // Sort terms by length (longest first) to avoid partial matches
  const sortedTerms = Object.keys(MEDICAL_TERMS).sort((a, b) => b.length - a.length);
  
  for (const term of sortedTerms) {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    wrappedText = wrappedText.replace(regex, `__MEDICAL_TERM_${term}__`);
  }
  
  return wrappedText;
}
