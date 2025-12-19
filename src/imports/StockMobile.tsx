import svgPaths from "./svg-gt4hwy99w6";

function Frame() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#181d27] text-[14px] text-nowrap">Farine</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame />
    </div>
  );
}

function Package() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Package">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Package">
          <path d={svgPaths.p15d46900} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Package />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[16px] text-center text-nowrap text-white">3</p>
    </div>
  );
}

function CardProduitLeadingLgGrayModernState() {
  return (
    <div className="bg-[#2239ee] content-stretch flex gap-[12px] items-center pl-[8px] pr-[12px] py-[4px] relative rounded-[48px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shrink-0" data-name="Card produit/Leading/lg/Gray/Modern/State6">
      <Frame4 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#2239ee] text-[14px] text-center text-nowrap">40 kg</p>
    </div>
  );
}

function CardProduitLeadingLgGrayModernState1() {
  return (
    <div className="bg-[#f5f5f6] content-stretch flex gap-[8px] items-center pl-[2px] pr-[12px] py-[2px] relative rounded-[48px] shrink-0" data-name="Card produit/Leading/lg/Gray/Modern/State6">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[48px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]" />
      <CardProduitLeadingLgGrayModernState />
      <Frame5 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <Frame1 />
      <CardProduitLeadingLgGrayModernState1 />
    </div>
  );
}

function BaseSlider() {
  return (
    <div className="absolute h-[5px] left-0 top-0 w-[250px]" data-name="Base Slider">
      <div className="absolute bg-[#f5f5f6] inset-0" data-name="area" />
      <div className="absolute bg-[#16a34a] h-[5px] left-0 right-[53px] top-0" data-name="progress" />
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] items-center left-[19px] top-[9px]">
      <div className="h-[6px] relative shrink-0 w-[8.589px]">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(113, 118, 128, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 6">
            <path d={svgPaths.p44ee500} fill="var(--fill-0, #717680)" id="Polygon 1" />
          </svg>
        </div>
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#535862] text-[12px] text-center text-nowrap">14 kg</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] items-center left-[196px] top-[9px]">
      <div className="h-[6px] relative shrink-0 w-[8.589px]">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(113, 118, 128, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 6">
            <path d={svgPaths.p44ee500} fill="var(--fill-0, #717680)" id="Polygon 1" />
          </svg>
        </div>
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#535862] text-[12px] text-center text-nowrap">14 kg</p>
    </div>
  );
}

function Slider() {
  return (
    <div className="basis-0 grow h-[43.167px] min-h-px min-w-px relative shrink-0" data-name="Slider">
      <BaseSlider />
      <div className="absolute h-[5px] left-[34px] top-0 w-0">
        <div className="absolute inset-[0_-0.5px]" style={{ "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 5">
            <path d="M0.5 0V5" id="Vector 1" stroke="var(--stroke-0, white)" />
          </svg>
        </div>
      </div>
      <div className="absolute h-[5px] left-[211px] top-0 w-0">
        <div className="absolute inset-[0_-0.5px]" style={{ "--stroke-0": "rgba(113, 118, 128, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 5">
            <path d="M0.5 0V5" id="Vector 2" stroke="var(--stroke-0, #717680)" />
          </svg>
        </div>
      </div>
      <Frame7 />
      <Frame8 />
    </div>
  );
}

function Alarm() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Alarm">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Alarm">
          <path d={svgPaths.p207c3500} fill="var(--fill-0, #B91C1C)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Alarm />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#b91c1c] text-[14px] text-center text-nowrap">1 lot</p>
    </div>
  );
}

function ProgressStepsOthers() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-center relative shrink-0 w-full" data-name="Progress steps / Others">
      <Slider />
      <Frame6 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame2 />
      <ProgressStepsOthers />
    </div>
  );
}

export default function StockMobile() {
  return (
    <div className="relative size-full" data-name="Stock mobile">
      <div aria-hidden="true" className="absolute border-[#e9eaeb] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-end size-full">
        <div className="content-stretch flex gap-[16px] items-end p-[16px] relative size-full">
          <Frame3 />
        </div>
      </div>
    </div>
  );
}