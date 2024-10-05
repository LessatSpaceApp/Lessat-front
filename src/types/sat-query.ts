export interface SatQueryRes {
  info: Info;
  passes: Pass[];
}

export interface Info {
  satid: number;
  satname: string;
  transactionscount: number;
  passescount: number;
}

export interface Pass {
  startAz: number;
  startAzCompass: string;
  startEl: number;
  startUTC: number;
  maxAz: number;
  maxAzCompass: string;
  maxEl: number;
  maxUTC: number;
  endAz: number;
  endAzCompass: string;
  endEl: number;
  endUTC: number;
  mag: number;
  duration: number;
  startVisibility: number;
  sat: string;
}
