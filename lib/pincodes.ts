// Every pincode below is verified against India Post by scripts/verify-pincodes.mjs.
export type ServiceCity = "Bangalore" | "Mumbai";

export interface ServiceArea {
  readonly area: string;
  readonly city: ServiceCity;
}

export const SERVICE_PINCODES: Readonly<Record<string, ServiceArea>> = {
  "560001": { area: "MG Road", city: "Bangalore" },
  "560002": { area: "Chickpet", city: "Bangalore" },
  "560003": { area: "Malleshwaram", city: "Bangalore" },
  "560004": { area: "Basavanagudi", city: "Bangalore" },
  "560005": { area: "Frazer Town", city: "Bangalore" },
  "560008": { area: "Ulsoor", city: "Bangalore" },
  "560009": { area: "Vasanth Nagar", city: "Bangalore" },
  "560010": { area: "Rajajinagar", city: "Bangalore" },
  "560011": { area: "Jayanagar", city: "Bangalore" },
  "560020": { area: "Seshadripuram", city: "Bangalore" },
  "560024": { area: "Hebbal", city: "Bangalore" },
  "560025": { area: "Richmond Town", city: "Bangalore" },
  "560027": { area: "Wilson Garden", city: "Bangalore" },
  "560032": { area: "RT Nagar", city: "Bangalore" },
  "560034": { area: "Koramangala", city: "Bangalore" },
  "560035": { area: "Sarjapur Road", city: "Bangalore" },
  "560037": { area: "Marathahalli", city: "Bangalore" },
  "560038": { area: "Indiranagar", city: "Bangalore" },
  "560040": { area: "Vijayanagar", city: "Bangalore" },
  "560041": { area: "Jayanagar East", city: "Bangalore" },
  "560043": { area: "Kalyan Nagar", city: "Bangalore" },
  "560047": { area: "Viveknagar", city: "Bangalore" },
  "560061": { area: "Uttarahalli", city: "Bangalore" },
  "560064": { area: "Yelahanka", city: "Bangalore" },
  "560066": { area: "Whitefield", city: "Bangalore" },
  "560068": { area: "BTM Layout", city: "Bangalore" },
  "560070": { area: "Banashankari", city: "Bangalore" },
  "560071": { area: "Domlur", city: "Bangalore" },
  "560072": { area: "Nagarbhavi", city: "Bangalore" },
  "560076": { area: "Bannerghatta Road", city: "Bangalore" },
  "560078": { area: "JP Nagar", city: "Bangalore" },
  "560079": { area: "Basaveshwaranagar", city: "Bangalore" },
  "560080": { area: "Sadashivanagar", city: "Bangalore" },
  "560085": { area: "Banashankari II Stage", city: "Bangalore" },
  "560094": { area: "Sanjay Nagar", city: "Bangalore" },
  "560095": { area: "Koramangala VIII Block", city: "Bangalore" },
  "560098": { area: "Rajarajeshwari Nagar", city: "Bangalore" },
  "560100": { area: "Electronic City", city: "Bangalore" },
  "560102": { area: "HSR Layout", city: "Bangalore" },
  "560103": { area: "Bellandur", city: "Bangalore" },
  "400001": { area: "Fort", city: "Mumbai" },
  "400005": { area: "Colaba", city: "Mumbai" },
  "400006": { area: "Malabar Hill", city: "Mumbai" },
  "400007": { area: "Grant Road", city: "Mumbai" },
  "400012": { area: "Parel", city: "Mumbai" },
  "400013": { area: "Lower Parel", city: "Mumbai" },
  "400014": { area: "Dadar East", city: "Mumbai" },
  "400016": { area: "Mahim", city: "Mumbai" },
  "400018": { area: "Worli", city: "Mumbai" },
  "400019": { area: "Matunga", city: "Mumbai" },
  "400020": { area: "Churchgate", city: "Mumbai" },
  "400021": { area: "Nariman Point", city: "Mumbai" },
  "400022": { area: "Sion", city: "Mumbai" },
  "400025": { area: "Prabhadevi", city: "Mumbai" },
  "400026": { area: "Cumballa Hill", city: "Mumbai" },
  "400028": { area: "Dadar West", city: "Mumbai" },
  "400034": { area: "Tardeo", city: "Mumbai" },
  "400049": { area: "Juhu", city: "Mumbai" },
  "400050": { area: "Bandra West", city: "Mumbai" },
  "400051": { area: "Bandra East", city: "Mumbai" },
  "400052": { area: "Khar West", city: "Mumbai" },
  "400053": { area: "Andheri West", city: "Mumbai" },
  "400054": { area: "Santacruz West", city: "Mumbai" },
  "400055": { area: "Santacruz East", city: "Mumbai" },
  "400057": { area: "Vile Parle East", city: "Mumbai" },
  "400058": { area: "Andheri West, Versova", city: "Mumbai" },
  "400059": { area: "Andheri East, Marol", city: "Mumbai" },
  "400063": { area: "Goregaon East", city: "Mumbai" },
  "400064": { area: "Malad West", city: "Mumbai" },
  "400066": { area: "Borivali East", city: "Mumbai" },
  "400067": { area: "Kandivali West", city: "Mumbai" },
  "400069": { area: "Andheri East", city: "Mumbai" },
  "400070": { area: "Kurla", city: "Mumbai" },
  "400071": { area: "Chembur", city: "Mumbai" },
  "400076": { area: "Powai", city: "Mumbai" },
  "400077": { area: "Ghatkopar East", city: "Mumbai" },
  "400078": { area: "Bhandup", city: "Mumbai" },
  "400080": { area: "Mulund West", city: "Mumbai" },
  "400081": { area: "Mulund East", city: "Mumbai" },
  "400086": { area: "Ghatkopar West", city: "Mumbai" },
  "400092": { area: "Borivali West", city: "Mumbai" },
  "400097": { area: "Malad East", city: "Mumbai" },
  "400101": { area: "Kandivali East", city: "Mumbai" },
  "400102": { area: "Jogeshwari West", city: "Mumbai" },
  "400104": { area: "Goregaon West", city: "Mumbai" },
};

export type PincodeResult =
  | { status: "invalid" }
  | { status: "covered"; area: ServiceArea }
  | { status: "not-covered" };

const PINCODE_PATTERN = /^[1-9][0-9]{5}$/;

export function lookupPincode(raw: string): PincodeResult {
  const trimmed = raw.trim();

  if (!PINCODE_PATTERN.test(trimmed)) {
    return { status: "invalid" };
  }

  const area = SERVICE_PINCODES[trimmed];
  return area ? { status: "covered", area } : { status: "not-covered" };
}
