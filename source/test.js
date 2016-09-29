var NativeWeights = {
      "zh": 14.1 + /*wu*/ 1.2% + /*cjy*/ 0.72 + /*hsn*/ 0.58 + /*hak*/ 0.46 +
            /*gan*/ 0.33 + /*mnp*/ 0.16 +/*cdo*/ 0.14 + /*hmx*/ 0.13 + 
            /*STR*/ 1.33,
      "es": 5.85, 
      "en": 5.52 + /*ER*/ 2.24, 
      "hi": 4.46  + /*awa*/ 0.33 + /*bgc*/ 0.21 + /*hne*/ 0.19 + 
            /*dcc*/  0.17 + /*IAR*/ 2.24,
      "ar": 4.23 + /*ha*/ 0.52 + /*AR*/ 0.63, "pt": 3.08, 
      "bn": 3.05 + /*ctg*/ 0.24 + /*as*/ 0.23 + /*bho*/ 0.43 + /*mai*/ 0.45 +
           /*or*/ 0.5  + /*mag*/ 0.21,
      "ru": 2.42 + /*uk*/ 0.46 + /*be*/ 0.11 + /*hbs*/ 0.28,
      "pa": 1.44 + /*skr*/ 0.26 + /*sd*/ 0.39 , 
      "de": 1.39, 
      "id": 1.16 + /*jv*/ 1.25 + /*th*/ 0.86 + /*su*/ 0.57 + /*tl*/ 0.42 +
            /*ceb*/ 0.32 + /*mg*/ 0.28 + /*mad*/ 0.23 + /*ilo*/ 0.14 + 
            /*hil*/ 0.12 + /*ANR*/ 0.5 + /*TKR*/ 0.14,
      "te": 1.15,
      "ta": 1.06 + /*DR*/ 0.14,
      "vi": 1.14 + /*km*/ 0.24 + /*AAR*/ 0.2,
      "ko": 1.14 + /*jp*/ 1.92 + /*JR*/ 0.07 + /*KR*/ 0.05, 
      "fr": 1.12 + /*ht*/ 0.15, "mr": 1.1 + /*kok*/ 0.11, 
      "ur": 0.99, 
      "tr": 0.95 + /*uz*/ 0.39 + /*tk*/ 0.24 + /*ug*/ 0.12 +/*TR*/ 0.43, 
      "it": 0.9, 
      "zhy": 0.89 + /*nan*/ 0.71, 
      "gu": 0.74 + /*mwr*/ 0.21 + /*dhd*/ 0.15, 
      "fa": 0.68 + /*ps*/ 0.58 + /*bal*/ 0.11, 
      "pl": 0.61, "kn": 0.58, 
      "ml": 0.57, "my": 0.50, 
      "sw": /*yo*/ 0.42 + /*ff*/ 0.37 + /*ny*/ 0.17 + /*ak*/ 0.17 + 
            /*rw*/ 0.15 + /*rn*/ 0.13 + /*sn*/ 0.13 + /*mos*/ 0.11 +
            /*xh*/ 0.11 + /*NCR*/ 4.65,
      "am": 0.37 + /*om*/ 0.36 + /*so*/ 0.22, "ro": 0.37,  
      "az": 0.34, "nl": 0.32, "ku": 0.31,
      "ne": 0.25, "si": 0.25, 
      "hu": 0.19 + /*UR*/ 0.13, "el": 0.18,
      "cs": 0.15, "sv": 0.13, "ka": 0.08
    },
    source = NativeWeights,
    sortableAr = [];

Object.keys(source).forEach(function (name) {
  sortableAr.push([name, source[name]]);
});

sortableAr.sort(function (first, next) {
  return next[1] - first[1];
});

sortableAr.forEach(function (item) {
  console.log(item[0] + "  " + item[1]);
});

var string = "";
sortableAr.forEach(function (item) {
  string += ('"' + item[0] + '", ');
});
console.log(string);
