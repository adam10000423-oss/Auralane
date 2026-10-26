(function(root){
  "use strict";
  // Google Translation NMT language identifiers. Region variants share a
  // language unless their written forms differ (notably Chinese).
  const codes=("ab ace ach af sq alz am ar hy as awa ay az ban bm ba eu btx bts bbc be bem bn bew bho bik bs br bg bua yue ca ceb ny zh-CN zh-TW chm cv co crh hr cs da din dv doi dov nl dz en eo et ee fj fil fi fr fr-FR fr-CA fy ff gaa gl lg ka de el gn gu ht cnh ha haw he hil hi hmn hu hrx is ig ilo id ga it ja jv kn pam kk km cgg rw ktu gom ko kri ku ckb ky lo ltg la lv lij li ln lt lmo luo lb mk mai mak mg ms ms-Arab ml mt mam gv mi mr mh mwr mfe min mni-Mtei lus mn my nhe ndc nr new ne no nus oc or om pag pap ps fa pl pt pt-PT pt-BR pa pa-Arab qu kek rom ro rn ru sm sg sa sat sat-Latn nso gd sr st crs shn sn scn szl sd si sk sl so es su sw ss sv tg ta tt te tet th bo ti tiv tpi to lua ts tn tr tk ak tcy tum udm uk ur ug uz ve vec vi war cy wo xh sah yi yo yua zap zu").split(" ");
  const overrides={"zh-TW":"繁體中文","zh-CN":"简体中文",yue:"粵語",fil:"Filipino",mni:"মৈতৈলোন্", "mni-Mtei":"ꯃꯤꯇꯩꯂꯣꯟ", "pa-Arab":"پنجابی", "ms-Arab":"بهاس ملايو", sat:"ᱥᱟᱱᱛᱟᱲᱤ", "sat-Latn":"Santali", cnh:"Lai", hmn:"Hmoob", kri:"Krio", ckb:"کوردی", ace:"Bahsa Acèh", ach:"Lwo", alz:"Alur", btx:"Cakap Karo", bts:"Sahap Simalungun", bbc:"Hata Batak", bew:"Betawi", bik:"Bikol", bua:"Буряад", cgg:"Rukiga", dov:"Chindau", gaa:"Gã", hil:"Ilonggo", hrx:"Hunsrik", ktu:"Kikongo ya leta", ltg:"Latgaļu", lmo:"Lombard", luo:"Dholuo", mak:"Basa Mangkasaraʼ", mam:"Qyol Mam", mwr:"मारवाड़ी", mfe:"Kreol Morisien", min:"Baso Minangkabau", nhe:"Nāhuatl", ndc:"ChiNdau", nus:"Thok Naath", pag:"Pangasinan", kek:"Qʼeqchiʼ", rom:"Romani", crs:"Seselwa", shn:"လိၵ်ႈတႆး", szl:"Ślōnski", tiv:"Tiv", tcy:"ತುಳು", tum:"Chitumbuka", udm:"Удмурт", vec:"Vèneto", war:"Winaray", yua:"Maaya tʼàan", zap:"Diidxazá"};
  Object.assign(overrides,{ab:"Аҧсуа",awa:"अवधी",ay:"Aymar aru",ban:"Basa Bali",ny:"Chichewa",chm:"Марий йылме",co:"Corsu",crh:"Qırımtatar tili",din:"Thuɔŋjäŋ",dv:"ދިވެހި",fj:"Vosa Vakaviti",gn:"Avañe'ẽ",ht:"Kreyòl ayisyen",ilo:"Ilokano",pam:"Kapampangan",la:"Latina",li:"Limburgs",mh:"Kajin M̧ajeļ",lus:"Mizo ṭawng",nr:"isiNdebele",new:"नेपाल भाषा",pap:"Papiamentu",sm:"Gagana Sāmoa",ss:"siSwati",tet:"Tetun",tpi:"Tok Pisin",lua:"Tshiluba",ts:"itsonga",ve:"Tshivenḓa"});
  Object.assign(overrides,{ba:"Башҡортса",bem:"Ichibemba",cv:"Чӑвашла",dz:"རྫོང་ཁ",ff:"Fulfulde",lij:"Ligure",gv:"Gaelg",rn:"Ikirundi",sg:"Sängö",scn:"Sicilianu",bo:"བོད་སྐད",sah:"Саха тыла",ts:"itsonga"});
  overrides.ts="XiTsonga";
  function nativeName(code){if(overrides[code])return overrides[code];try{const locale=Intl.DisplayNames.supportedLocalesOf([code]).length?code:"en";return new Intl.DisplayNames([locale],{type:"language",languageDisplay:"standard"}).of(code)||code;}catch{return code;}}
  function detect(values=root.navigator?.languages||[root.navigator?.language||"en"]){
    for(const value of values){const tag=String(value||"");if(/^zh/i.test(tag))return /(?:TW|HK|MO|Hant)/i.test(tag)?"zh-TW":"zh-CN";const exact=codes.find(c=>c.toLowerCase()===tag.toLowerCase());if(exact)return exact;const base=tag.split("-")[0];if(codes.includes(base))return base;}
    return "en";
  }
  function populate(select,value){if(!select)return;select.dataset.i18nSkip="";select.replaceChildren(...codes.map(code=>{const option=document.createElement("option");option.value=code;option.textContent=nativeName(code);return option;}));select.value=codes.includes(value)?value:detect();root.AuralaneLanguagePicker?.attach(select);}
  const pending=new Map();
  async function ensure(code,core,component,onBatch){
    if(pending.has(code))return pending.get(code);
    const task=(async()=>{
      const cacheKey=`auralane:ui-translation:v1:${code}`;
      let cached={};try{cached=JSON.parse(localStorage.getItem(cacheKey)||"{}");}catch{}
      core[code]||={};component[code]||={};
      const all=[...new Set([...Object.values(core.en),...Object.keys(component.en)])];
      const apply=()=>{for(const [key,value]of Object.entries(core.en))if(cached[value])core[code][key]=cached[value];for(const key of Object.keys(component.en))if(cached[key])component[code][key]=cached[key];onBatch();};apply();
      const missing=all.filter(text=>!cached[text]);let cursor=0;
      async function worker(){while(cursor<missing.length){const batch=missing.slice(cursor,cursor+=24);try{const result=await root.metro.translateLyrics(batch.map(text=>({text})),{targetLanguage:code,sourceLanguage:"en"});for(let i=0;i<batch.length;i++){const value=result.lines?.[i]?.text,tokens=batch[i].match(/\{[^}]+\}/g)||[];if(typeof value==="string"&&value&&value!==batch[i]&&tokens.every(token=>value.includes(token)))cached[batch[i]]=value;}localStorage.setItem(cacheKey,JSON.stringify(cached));apply();}catch{return;}}}
      await Promise.all([worker(),worker()]);
    })().finally(()=>pending.delete(code));pending.set(code,task);return task;
  }
  const api={codes,nativeName,detect,populate,ensure};
  if(typeof module==="object")module.exports=api;else root.AuralaneLanguages=api;
})(typeof window==="object"?window:globalThis);
