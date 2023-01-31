module.exports.areas = {
  PER: {
    name: 'PER',
    label: 'Responsibility of personating',
    key: 'settings.countries.role_documents.personating',
    prefix: 'settings.countries.role_documents.prefix.personating',
    parties: { source: null, destination: null },
    intro: false
  },
  TT: {
    name: 'TT',
    label: 'Tutor declaration',
    key: 'settings.countries.role_documents.tutor',
    prefix: 'settings.countries.role_documents.prefix.tutor',
    parties: { source: 'individual', destination: 'individual' },
    intro: false
  },
  RE: {
    name: 'RE',
    label: 'Referent declaration',
    key: 'settings.countries.role_documents.referent',
    prefix: 'settings.countries.role_documents.prefix.referent',
    parties: { source: 'business', destination: 'individual' },
    intro: false
  },
  DI: {
    name: 'DI',
    label: 'Director Declaration',
    key: 'settings.countries.role_documents.director',
    prefix: 'settings.countries.role_documents.prefix.director',
    parties: { source: 'business', destination: 'individual' },
    intro: true
  },
  OP: {
    name: 'OP',
    label: 'Operator declaration',
    key: 'settings.countries.role_documents.operator',
    prefix: 'settings.countries.role_documents.prefix.operator',
    parties: { source: 'business', destination: 'individual' },
    intro: true
  },
  PT: {
    name: 'PT',
    label: 'Personal Trainer declaration',
    key: 'settings.countries.role_documents.personal_trainer',
    prefix: 'settings.countries.role_documents.prefix.personal_trainer',
    parties: { source: 'business', destination: 'individual' },
    intro: true
  },
  CT: {
    name: 'CT',
    label: 'Course Trainer declaration',
    key: 'settings.countries.role_documents.course_trainer',
    prefix: 'settings.countries.role_documents.prefix.course_trainer',
    parties: { source: 'business', destination: 'individual' },
    intro: true
  },
  SA: {
    name: 'SA',
    label: 'Sport Assistant',
    key: 'settings.countries.role_documents.sport_assistant',
    prefix: 'settings.countries.role_documents.prefix.sport_assistant',
    parties: { source: 'business', destination: 'individual' },
    intro: true
  },
  SP: {
    name: 'SP',
    label: 'Salesperson declaration',
    key: 'settings.countries.role_documents.salesperson',
    prefix: 'settings.countries.role_documents.prefix.salesperson',
    parties: { source: 'business', destination: 'individual' },
    intro: true
  },
  CL: {
    name: 'CL',
    label: 'Responsibility of cleaner',
    key: 'settings.countries.role_documents.cleaner',
    prefix: 'settings.countries.role_documents.prefix.cleaner',
    parties: { source: 'business', destination: 'individual' },
    intro: true
  }
}
