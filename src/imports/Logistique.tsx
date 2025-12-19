import svgPaths from "./svg-p60lyl9051";
import imgContent from "../assets/12ce1b9c25cc8b1d301adad48242561ecdad36a4.png";
import imgRectangle from "../assets/99cad97ab0027735cc0733819e76354dff29b254.png";

function Frame2() {
  return (
    <div className="basis-0 bg-[#12895a] grow h-full min-h-px min-w-px relative rounded-[3px] shrink-0">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[6px] py-[3px] relative size-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[12px] text-center text-nowrap text-white">Clients</p>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="basis-0 bg-white grow h-full min-h-px min-w-px relative rounded-[3px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#dcdcdc] border-solid inset-0 pointer-events-none rounded-[3px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[9px] py-[3px] relative size-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#9b9b9b] text-[12px] text-center text-nowrap">Produits</p>
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="basis-0 content-stretch flex gap-[16px] grow h-[26px] items-start min-h-px min-w-px relative shrink-0">
      <Frame2 />
      <Frame1 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[15px] items-start justify-center relative shrink-0 w-full">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#141414] text-[16px] text-center text-nowrap">Commandes</p>
      <Frame3 />
    </div>
  );
}

function ContrastBorder() {
  return <div className="absolute inset-[0_0.44px_0.44px_0] opacity-[0.08] rounded-[122.917px]" data-name="Contrast border" />;
}

function Content() {
  return (
    <div className="absolute h-[32px] left-[calc(50%-154.5px)] overflow-clip top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%] w-[34px]" data-name="Content">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgContent} />
      <ContrastBorder />
    </div>
  );
}

function Frame8() {
  return (
    <div className="h-[73px] relative shrink-0 w-[357px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[285px] not-italic text-[10px] text-black text-nowrap top-[53px]">N° 210</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[60px] not-italic text-[12px] text-black text-nowrap top-[37px]">Livraison prévue le 18/12</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[60px] not-italic text-[8px] text-black text-nowrap top-[47px]">Dans 10 jours</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[60px] not-italic text-[12px] text-black text-nowrap top-[16px]">{`Client : Dupont `}</p>
        <div className="absolute left-[278px] size-[47px] top-[10px]" data-name="Rectangle">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgRectangle} />
          </div>
        </div>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[125px] not-italic text-[#7e7e7e] text-[12px] text-nowrap top-[80px]">Tapenade Noire</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[112px] not-italic text-[#7e7e7e] text-[12px] text-nowrap text-right top-[80px] translate-x-[-100%]">100 kg</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[125px] not-italic text-[#7e7e7e] text-[12px] text-nowrap top-[100px]">Tapenade Verte</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[112px] not-italic text-[#7e7e7e] text-[12px] text-nowrap text-right top-[100px] translate-x-[-100%]">20 kg</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[125px] not-italic text-[#7e7e7e] text-[12px] text-nowrap top-[120px]">Tapenade Violette</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[112px] not-italic text-[#7e7e7e] text-[12px] text-nowrap text-right top-[120px] translate-x-[-100%]">10 kg</p>
        <div className="absolute flex h-[45px] items-center justify-center left-[258px] top-[12px] w-[20px]" style={{ "--transform-inner-width": "45.796875", "--transform-inner-height": "20" } as React.CSSProperties}>
          <div className="flex-none rotate-[270deg]">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative text-[#8b8b8b] text-[8px] text-nowrap">{`Commande `}</p>
          </div>
        </div>
        <div className="absolute flex inset-[13.7%_2.8%_80.82%_94.4%] items-center justify-center">
          <div className="flex-none h-[10px] rotate-[270deg] w-[4px]">
            <div className="relative size-full" data-name="Icon">
              <div className="absolute inset-[-7.5%_-18.75%]" style={{ "--stroke-0": "rgba(113, 118, 128, 1)" } as React.CSSProperties}>
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 12">
                  <path d={svgPaths.p2b2f5900} id="Icon" stroke="var(--stroke-0, #717680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[242px] not-italic text-[8px] text-black text-nowrap text-right top-[16px] translate-x-[-100%]">2 300 €</p>
        <Content />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function ContrastBorder1() {
  return <div className="absolute inset-[0_0.44px_0.44px_0] opacity-[0.08] rounded-[122.917px]" data-name="Contrast border" />;
}

function Content1() {
  return (
    <div className="absolute h-[32px] left-[calc(50%-154.5px)] overflow-clip top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%] w-[34px]" data-name="Content">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgContent} />
      <ContrastBorder1 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="h-[73px] relative shrink-0 w-[357px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[285px] not-italic text-[10px] text-black text-nowrap top-[53px]">N° 211</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[60px] not-italic text-[12px] text-black text-nowrap top-[37px]">Livraison prévue le 20/12</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[60px] not-italic text-[8px] text-black text-nowrap top-[47px]">Dans 12 jours</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[60px] not-italic text-[12px] text-black text-nowrap top-[16px]">{`Client : Durant `}</p>
        <div className="absolute left-[278px] size-[47px] top-[10px]" data-name="Rectangle">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgRectangle} />
          </div>
        </div>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[125px] not-italic text-[#7e7e7e] text-[12px] text-nowrap top-[80px]">Tapenade Noire</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[112px] not-italic text-[#7e7e7e] text-[12px] text-nowrap text-right top-[80px] translate-x-[-100%]">100 kg</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[125px] not-italic text-[#7e7e7e] text-[12px] text-nowrap top-[100px]">Tapenade Verte</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[112px] not-italic text-[#7e7e7e] text-[12px] text-nowrap text-right top-[100px] translate-x-[-100%]">20 kg</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[125px] not-italic text-[#7e7e7e] text-[12px] text-nowrap top-[120px]">Tapenade Violette</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[112px] not-italic text-[#7e7e7e] text-[12px] text-nowrap text-right top-[120px] translate-x-[-100%]">10 kg</p>
        <div className="absolute flex h-[45px] items-center justify-center left-[258px] top-[12px] w-[20px]" style={{ "--transform-inner-width": "45.796875", "--transform-inner-height": "20" } as React.CSSProperties}>
          <div className="flex-none rotate-[270deg]">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative text-[#8b8b8b] text-[8px] text-nowrap">{`Commande `}</p>
          </div>
        </div>
        <div className="absolute flex inset-[13.7%_2.8%_80.82%_94.4%] items-center justify-center">
          <div className="flex-none h-[10px] rotate-[270deg] w-[4px]">
            <div className="relative size-full" data-name="Icon">
              <div className="absolute inset-[-7.5%_-18.75%]" style={{ "--stroke-0": "rgba(113, 118, 128, 1)" } as React.CSSProperties}>
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 12">
                  <path d={svgPaths.p2b2f5900} id="Icon" stroke="var(--stroke-0, #717680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[242px] not-italic text-[8px] text-black text-nowrap text-right top-[16px] translate-x-[-100%]">1 100 €</p>
        <Content1 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function ContrastBorder2() {
  return <div className="absolute inset-[0_0.44px_0.44px_0] opacity-[0.08] rounded-[122.917px]" data-name="Contrast border" />;
}

function Content2() {
  return (
    <div className="absolute h-[32px] left-[calc(50%-154.5px)] overflow-clip top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%] w-[34px]" data-name="Content">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgContent} />
      <ContrastBorder2 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="h-[73px] relative shrink-0 w-[357px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[285px] not-italic text-[10px] text-black text-nowrap top-[53px]">N° 212</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[60px] not-italic text-[12px] text-black text-nowrap top-[37px]">Livraison prévue le 22/12</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[60px] not-italic text-[8px] text-black text-nowrap top-[47px]">Dans 14 jours</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[60px] not-italic text-[12px] text-black text-nowrap top-[16px]">{`Client : Lefèvre `}</p>
        <div className="absolute left-[278px] size-[47px] top-[10px]" data-name="Rectangle">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgRectangle} />
          </div>
        </div>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[125px] not-italic text-[#7e7e7e] text-[12px] text-nowrap top-[80px]">Tapenade Noire</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[112px] not-italic text-[#7e7e7e] text-[12px] text-nowrap text-right top-[80px] translate-x-[-100%]">100 kg</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[125px] not-italic text-[#7e7e7e] text-[12px] text-nowrap top-[100px]">Tapenade Verte</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[112px] not-italic text-[#7e7e7e] text-[12px] text-nowrap text-right top-[100px] translate-x-[-100%]">20 kg</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[125px] not-italic text-[#7e7e7e] text-[12px] text-nowrap top-[120px]">Tapenade Violette</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[112px] not-italic text-[#7e7e7e] text-[12px] text-nowrap text-right top-[120px] translate-x-[-100%]">10 kg</p>
        <div className="absolute flex h-[45px] items-center justify-center left-[258px] top-[12px] w-[20px]" style={{ "--transform-inner-width": "45.796875", "--transform-inner-height": "20" } as React.CSSProperties}>
          <div className="flex-none rotate-[270deg]">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative text-[#8b8b8b] text-[8px] text-nowrap">{`Commande `}</p>
          </div>
        </div>
        <div className="absolute flex inset-[13.7%_2.8%_80.82%_94.4%] items-center justify-center">
          <div className="flex-none h-[10px] rotate-[270deg] w-[4px]">
            <div className="relative size-full" data-name="Icon">
              <div className="absolute inset-[-7.5%_-18.75%]" style={{ "--stroke-0": "rgba(113, 118, 128, 1)" } as React.CSSProperties}>
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 12">
                  <path d={svgPaths.p2b2f5900} id="Icon" stroke="var(--stroke-0, #717680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[242px] not-italic text-[8px] text-black text-nowrap text-right top-[16px] translate-x-[-100%]">300 €</p>
        <Content2 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function ContrastBorder3() {
  return <div className="absolute inset-[0_0.44px_0.44px_0] opacity-[0.08] rounded-[122.917px]" data-name="Contrast border" />;
}

function Content3() {
  return (
    <div className="absolute h-[32px] left-[calc(50%-154.5px)] overflow-clip top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%] w-[34px]" data-name="Content">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgContent} />
      <ContrastBorder3 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="h-[73px] relative shrink-0 w-[357px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[285px] not-italic text-[10px] text-black text-nowrap top-[53px]">N° 213</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[60px] not-italic text-[12px] text-black text-nowrap top-[37px]">Livraison prévue le 04/01</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[60px] not-italic text-[8px] text-black text-nowrap top-[47px]">Dans 17 jours</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[60px] not-italic text-[12px] text-black text-nowrap top-[16px]">{`Client : Martin `}</p>
        <div className="absolute left-[278px] size-[47px] top-[10px]" data-name="Rectangle">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgRectangle} />
          </div>
        </div>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[125px] not-italic text-[#7e7e7e] text-[12px] text-nowrap top-[80px]">Tapenade Noire</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[112px] not-italic text-[#7e7e7e] text-[12px] text-nowrap text-right top-[80px] translate-x-[-100%]">100 kg</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[125px] not-italic text-[#7e7e7e] text-[12px] text-nowrap top-[100px]">Tapenade Verte</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[112px] not-italic text-[#7e7e7e] text-[12px] text-nowrap text-right top-[100px] translate-x-[-100%]">20 kg</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[125px] not-italic text-[#7e7e7e] text-[12px] text-nowrap top-[120px]">Tapenade Violette</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[112px] not-italic text-[#7e7e7e] text-[12px] text-nowrap text-right top-[120px] translate-x-[-100%]">10 kg</p>
        <div className="absolute flex h-[45px] items-center justify-center left-[258px] top-[12px] w-[20px]" style={{ "--transform-inner-width": "45.796875", "--transform-inner-height": "20" } as React.CSSProperties}>
          <div className="flex-none rotate-[270deg]">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative text-[#8b8b8b] text-[8px] text-nowrap">{`Commande `}</p>
          </div>
        </div>
        <div className="absolute flex inset-[13.7%_2.8%_80.82%_94.4%] items-center justify-center">
          <div className="flex-none h-[10px] rotate-[270deg] w-[4px]">
            <div className="relative size-full" data-name="Icon">
              <div className="absolute inset-[-7.5%_-18.75%]" style={{ "--stroke-0": "rgba(113, 118, 128, 1)" } as React.CSSProperties}>
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 12">
                  <path d={svgPaths.p2b2f5900} id="Icon" stroke="var(--stroke-0, #717680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[242px] not-italic text-[8px] text-black text-nowrap text-right top-[16px] translate-x-[-100%]">500 €</p>
        <Content3 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function ContrastBorder4() {
  return <div className="absolute inset-[0_0.44px_0.44px_0] opacity-[0.08] rounded-[122.917px]" data-name="Contrast border" />;
}

function Content4() {
  return (
    <div className="absolute h-[32px] left-[calc(50%-154.5px)] overflow-clip top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%] w-[34px]" data-name="Content">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgContent} />
      <ContrastBorder4 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="h-[73px] relative shrink-0 w-[357px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[285px] not-italic text-[10px] text-black text-nowrap top-[53px]">N° 214</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[60px] not-italic text-[12px] text-black text-nowrap top-[37px]">Livraison prévue le 12/01</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[60px] not-italic text-[8px] text-black text-nowrap top-[47px]">Dans 25 jours</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[60px] not-italic text-[12px] text-black text-nowrap top-[16px]">{`Client : Petit `}</p>
        <div className="absolute left-[278px] size-[47px] top-[10px]" data-name="Rectangle">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgRectangle} />
          </div>
        </div>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[125px] not-italic text-[#7e7e7e] text-[12px] text-nowrap top-[80px]">Tapenade Noire</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[112px] not-italic text-[#7e7e7e] text-[12px] text-nowrap text-right top-[80px] translate-x-[-100%]">100 kg</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[125px] not-italic text-[#7e7e7e] text-[12px] text-nowrap top-[100px]">Tapenade Verte</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[112px] not-italic text-[#7e7e7e] text-[12px] text-nowrap text-right top-[100px] translate-x-[-100%]">20 kg</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[125px] not-italic text-[#7e7e7e] text-[12px] text-nowrap top-[120px]">Tapenade Violette</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[112px] not-italic text-[#7e7e7e] text-[12px] text-nowrap text-right top-[120px] translate-x-[-100%]">10 kg</p>
        <div className="absolute flex h-[45px] items-center justify-center left-[258px] top-[12px] w-[20px]" style={{ "--transform-inner-width": "45.796875", "--transform-inner-height": "20" } as React.CSSProperties}>
          <div className="flex-none rotate-[270deg]">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative text-[#8b8b8b] text-[8px] text-nowrap">{`Commande `}</p>
          </div>
        </div>
        <div className="absolute flex inset-[13.7%_2.8%_80.82%_94.4%] items-center justify-center">
          <div className="flex-none h-[10px] rotate-[270deg] w-[4px]">
            <div className="relative size-full" data-name="Icon">
              <div className="absolute inset-[-7.5%_-18.75%]" style={{ "--stroke-0": "rgba(113, 118, 128, 1)" } as React.CSSProperties}>
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 12">
                  <path d={svgPaths.p2b2f5900} id="Icon" stroke="var(--stroke-0, #717680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[242px] not-italic text-[8px] text-black text-nowrap text-right top-[16px] translate-x-[-100%]">1 000 €</p>
        <Content4 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function ContrastBorder5() {
  return <div className="absolute inset-[0_0.44px_0.44px_0] opacity-[0.08] rounded-[122.917px]" data-name="Contrast border" />;
}

function Content5() {
  return (
    <div className="absolute h-[32px] left-[calc(50%-154.5px)] overflow-clip top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%] w-[34px]" data-name="Content">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgContent} />
      <ContrastBorder5 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="h-[73px] relative shrink-0 w-[357px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[285px] not-italic text-[10px] text-black text-nowrap top-[53px]">N° 215</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[60px] not-italic text-[12px] text-black text-nowrap top-[37px]">Livraison prévue le 17/01</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[60px] not-italic text-[8px] text-black text-nowrap top-[47px]">Dans 30 jours</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[60px] not-italic text-[12px] text-black text-nowrap top-[16px]">{`Client : Dubois `}</p>
        <div className="absolute left-[278px] size-[47px] top-[10px]" data-name="Rectangle">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgRectangle} />
          </div>
        </div>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[125px] not-italic text-[#7e7e7e] text-[12px] text-nowrap top-[80px]">Tapenade Noire</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[112px] not-italic text-[#7e7e7e] text-[12px] text-nowrap text-right top-[80px] translate-x-[-100%]">100 kg</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[125px] not-italic text-[#7e7e7e] text-[12px] text-nowrap top-[100px]">Tapenade Verte</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[112px] not-italic text-[#7e7e7e] text-[12px] text-nowrap text-right top-[100px] translate-x-[-100%]">20 kg</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[125px] not-italic text-[#7e7e7e] text-[12px] text-nowrap top-[120px]">Tapenade Violette</p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[112px] not-italic text-[#7e7e7e] text-[12px] text-nowrap text-right top-[120px] translate-x-[-100%]">10 kg</p>
        <div className="absolute flex h-[45px] items-center justify-center left-[258px] top-[12px] w-[20px]" style={{ "--transform-inner-width": "45.796875", "--transform-inner-height": "20" } as React.CSSProperties}>
          <div className="flex-none rotate-[270deg]">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative text-[#8b8b8b] text-[8px] text-nowrap">{`Commande `}</p>
          </div>
        </div>
        <div className="absolute flex inset-[13.7%_2.8%_80.82%_94.4%] items-center justify-center">
          <div className="flex-none h-[10px] rotate-[270deg] w-[4px]">
            <div className="relative size-full" data-name="Icon">
              <div className="absolute inset-[-7.5%_-18.75%]" style={{ "--stroke-0": "rgba(113, 118, 128, 1)" } as React.CSSProperties}>
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 12">
                  <path d={svgPaths.p2b2f5900} id="Icon" stroke="var(--stroke-0, #717680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[242px] not-italic text-[8px] text-black text-nowrap text-right top-[16px] translate-x-[-100%]">900 €</p>
        <Content5 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame4() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[13px] grow items-start min-h-px min-w-px relative shrink-0 w-[357px]">
      <Frame8 />
      <Frame14 />
      <Frame10 />
      <Frame11 />
      <Frame12 />
      <Frame13 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-center min-h-px min-w-px relative shrink-0 w-full">
      <Frame4 />
    </div>
  );
}

function Component() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[15px] h-[639px] items-center left-1/2 overflow-clip px-[18px] py-[28px] top-[139px] translate-x-[-50%] w-[393px]" data-name="2">
      <Frame9 />
      <Frame15 />
    </div>
  );
}

function StatusBarTime() {
  return (
    <div className="h-[21px] relative rounded-[24px] shrink-0 w-[54px]" data-name="_StatusBar-time">
      <p className="absolute font-['SF_Pro_Text:Semibold',sans-serif] h-[20px] leading-[21px] left-[27px] not-italic text-[16px] text-black text-center top-px tracking-[-0.32px] translate-x-[-50%] w-[54px]">9:41</p>
    </div>
  );
}

function LeftSide() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="Left Side">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center pb-[3px] pl-[10px] pr-0 pt-0 relative size-full">
          <StatusBarTime />
        </div>
      </div>
    </div>
  );
}

function TrueDepthCamera() {
  return <div className="absolute bg-black h-[37px] left-[calc(50%-22.5px)] rounded-[100px] top-1/2 translate-x-[-50%] translate-y-[-50%] w-[80px]" data-name="TrueDepth camera" />;
}

function FaceTimeCamera() {
  return <div className="absolute bg-black left-[calc(50%+44px)] rounded-[100px] size-[37px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="FaceTime camera" />;
}

function StatusBarDynamicIsland() {
  return (
    <div className="bg-black h-[37px] relative rounded-[100px] shrink-0 w-[125px]" data-name="StatusBar-dynamicIsland">
      <TrueDepthCamera />
      <FaceTimeCamera />
    </div>
  );
}

function DynamicIsland() {
  return (
    <div className="content-stretch flex flex-col h-full items-center justify-center relative shrink-0" data-name="Dynamic Island">
      <StatusBarDynamicIsland />
    </div>
  );
}

function SignalWifiBattery() {
  return (
    <div className="h-[13px] relative shrink-0 w-[78.401px]" data-name="Signal, Wifi, Battery">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 79 13">
        <g id="Signal, Wifi, Battery">
          <g id="Icon / Mobile Signal">
            <path d={svgPaths.p1ec31400} fill="var(--fill-0, black)" />
            <path d={svgPaths.p19f8d480} fill="var(--fill-0, black)" />
            <path d={svgPaths.p13f4aa00} fill="var(--fill-0, black)" />
            <path d={svgPaths.p1bfb7500} fill="var(--fill-0, black)" />
          </g>
          <path d={svgPaths.p36909200} fill="var(--fill-0, black)" id="Wifi" />
          <g id="_StatusBar-battery">
            <path d={svgPaths.pb6b7100} id="Outline" opacity="0.35" stroke="var(--stroke-0, black)" />
            <path d={svgPaths.p9c6aca0} fill="var(--fill-0, black)" id="Battery End" opacity="0.4" />
            <path d={svgPaths.p2cb42c00} fill="var(--fill-0, black)" id="Fill" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function RightSide() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="Right Side">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-0 pr-[11px] py-0 relative size-full">
          <SignalWifiBattery />
        </div>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="absolute bg-white content-stretch flex h-[59px] items-end justify-center left-1/2 top-0 translate-x-[-50%] w-[393px]" data-name="StatusBar">
      <LeftSide />
      <DynamicIsland />
      <RightSide />
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="absolute bottom-0 h-[34px] left-[calc(50%+0.5px)] translate-x-[-50%] w-[390px]" data-name="HomeIndicator">
      <div className="absolute bg-black bottom-[8px] h-[5px] left-1/2 rounded-[100px] translate-x-[-50%] w-[134px]" data-name="Home Indicator" />
    </div>
  );
}

function Url() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="URL">
      <div className="h-[8.716px] relative shrink-0 w-[5.968px]" data-name="SF Symbol / lock.fill">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 9">
          <path d={svgPaths.p123f0300} fill="var(--fill-0, #3C3C43)" fillOpacity="0.6" id="SF Symbol / lock.fill" />
        </svg>
      </div>
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black text-nowrap">
        <p className="leading-[16px]">apenda.app/</p>
      </div>
    </div>
  );
}

function TabBar() {
  return (
    <div className="absolute backdrop-blur-[10px] backdrop-filter bg-white left-1/2 top-[59px] translate-x-[-50%] w-[393px]" data-name="TabBar">
      <div className="content-stretch flex flex-col items-center overflow-clip pb-[8px] pt-0 px-0 relative rounded-[inherit] w-full">
        <Url />
      </div>
      <div aria-hidden="true" className="absolute border-[0px_0px_0.5px] border-[rgba(60,60,67,0.36)] border-solid inset-[0_0_-0.25px_0] pointer-events-none" />
    </div>
  );
}

function House() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="House">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="House">
          <path d={svgPaths.p9801500} fill="var(--fill-0, #D5D7DA)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function NavigationMenuHome() {
  return (
    <div className="content-stretch flex flex-col h-[49px] items-center justify-between relative shrink-0" data-name="navigation/menu - home">
      <div className="bg-[#12895a] h-[4px] opacity-0 rounded-tl-[6px] rounded-tr-[6px] shrink-0 w-[64px]" />
      <House />
    </div>
  );
}

function MenuItem() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Menu Item">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center pb-[24px] pt-0 px-[8px] relative w-full">
          <NavigationMenuHome />
        </div>
      </div>
    </div>
  );
}

function BookmarksSimple() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="BookmarksSimple">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="BookmarksSimple">
          <path d={svgPaths.p3e2c9672} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.p2705e300} fill="var(--fill-0, white)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function NavigationMenuHome1() {
  return (
    <div className="content-stretch flex flex-col gap-[21px] items-center relative shrink-0" data-name="navigation/menu - home">
      <div className="bg-[#12895a] h-[4px] rounded-bl-[4px] rounded-br-[4px] shrink-0 w-[64px]" data-name="Indicator" />
      <BookmarksSimple />
    </div>
  );
}

function MenuItem1() {
  return (
    <div className="basis-0 grow h-[75px] min-h-px min-w-px relative shrink-0" data-name="Menu Item">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center pb-[24px] pt-0 px-[8px] relative size-full">
          <NavigationMenuHome1 />
        </div>
      </div>
    </div>
  );
}

function BellSimple() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="BellSimple">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="BellSimple">
          <path d={svgPaths.p1c4d9180} fill="var(--fill-0, #D5D7DA)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function NavigationMenuHome2() {
  return (
    <div className="content-stretch flex flex-col gap-[19px] items-center relative shrink-0" data-name="navigation/menu - home">
      <div className="bg-[#12895a] h-[4px] opacity-0 rounded-tl-[6px] rounded-tr-[6px] shrink-0 w-[64px]" />
      <BellSimple />
    </div>
  );
}

function MenuItem2() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Menu Item">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center pb-[24px] pt-0 px-[8px] relative w-full">
          <NavigationMenuHome2 />
        </div>
      </div>
    </div>
  );
}

function List() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="List">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="List">
          <path d={svgPaths.p2136a900} fill="var(--fill-0, #D5D7DA)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function NavigationMenuHome3() {
  return (
    <div className="content-stretch flex flex-col gap-[19px] items-center relative shrink-0" data-name="navigation/menu - home">
      <div className="bg-[#12895a] h-[4px] opacity-0 rounded-tl-[6px] rounded-tr-[6px] shrink-0 w-[64px]" />
      <List />
    </div>
  );
}

function MenuItem3() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Menu Item">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center pb-[24px] pt-0 px-[8px] relative w-full">
          <NavigationMenuHome3 />
        </div>
      </div>
    </div>
  );
}

function NavBarAtelier() {
  return (
    <div className="absolute bg-[#12895a] bottom-0 content-stretch flex items-center justify-between left-1/2 px-[16px] py-0 translate-x-[-50%] w-[393px]" data-name="Nav bar atelier">
      <div aria-hidden="true" className="absolute border-[#12895a] border-[1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <MenuItem />
      <MenuItem1 />
      <MenuItem2 />
      <MenuItem3 />
    </div>
  );
}

function ChevronLeft() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="chevron-left">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="chevron-left">
          <path d="M15 18L9 12L15 6" id="Icon" stroke="var(--stroke-0, #717680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Buttons() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center px-0 py-[10px] relative rounded-[8px] shrink-0" data-name="Buttons">
      <ChevronLeft />
    </div>
  );
}

function Frame() {
  return (
    <button className="content-stretch cursor-pointer flex items-center p-0 relative shrink-0">
      <Buttons />
    </button>
  );
}

function Frame5() {
  return (
    <div className="bg-[#12895a] content-stretch flex gap-[9px] items-center px-[6px] py-[3px] relative rounded-[3px] shrink-0">
      <div className="h-[10px] relative shrink-0 w-[18px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 10">
          <path d={svgPaths.p29f9b180} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[12px] text-center text-nowrap text-white">Liste</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-white content-stretch flex gap-[9px] items-center px-[9px] py-[3px] relative rounded-[3px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#dcdcdc] border-solid inset-0 pointer-events-none rounded-[3px]" />
      <div className="h-[12px] relative shrink-0 w-[16px]">
        <div className="absolute inset-[-4.17%_-3.13%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 13">
            <g id="Vector 1326">
              <path d={svgPaths.p2861eb80} fill="var(--fill-0, #9B9B9B)" />
              <path d={svgPaths.p1c04500} stroke="var(--stroke-0, white)" />
            </g>
          </svg>
        </div>
      </div>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#9b9b9b] text-[12px] text-center text-nowrap">Calendrier</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="basis-0 content-stretch flex gap-[16px] grow items-start justify-end min-h-px min-w-px relative shrink-0">
      <Frame5 />
      <Frame6 />
    </div>
  );
}

function Header() {
  return (
    <div className="absolute bg-white h-[56px] left-0 top-[83px] w-[393px]" data-name="Header">
      <div className="content-stretch flex gap-[16px] items-center overflow-clip px-[16px] py-[8px] relative rounded-[inherit] size-full">
        <Frame />
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#181d27] text-[16px] text-center text-nowrap">Logistique</p>
        <Frame7 />
      </div>
      <div aria-hidden="true" className="absolute border-[#d5d7da] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

export default function Logistique() {
  return (
    <div className="bg-white relative size-full" data-name="Logistique">
      <Component />
      <StatusBar />
      <HomeIndicator />
      <TabBar />
      <NavBarAtelier />
      <Header />
    </div>
  );
}