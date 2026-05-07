type CompanyDetails = {
  fullName: string;
  legalForm: string;
  street: string;
  zip: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  ustId?: string;
  responsibleForContent: string;
};

export const COMPANY_DETAILS: CompanyDetails = {
  fullName: "Viacheslav Korolov", // TODO: Slava заполнит
  legalForm: "Einzelunternehmen", // TODO: Slava заполнит
  street: "Stegelwardstraße 14", // TODO: Slava заполнит
  zip: "51373", // TODO: Slava заполнит
  city: "Leverkusen", // TODO: Slava заполнит
  country: "Deutschland", // TODO: Slava заполнит
  email: "info@korolov-it-service.de", // TODO: Slava заполнит
  phone: "+491638251736", // TODO: Slava заполнит
  ustId: "Kleinunternehmer gemäß § 19 UStG", // TODO: Slava заполнит
  responsibleForContent: "Viacheslav Korolov", // TODO: Slava заполнит
};
