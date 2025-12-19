import svgPaths from "./svg-jrx7isaw13";

function Package() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Package">
      <div className="absolute inset-[0_-81.25%_-87.47%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29 30">
          <g id="Package">
            <path d={svgPaths.p3e7e4500} fill="var(--fill-0, white)" id="Vector" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Package />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[16px] text-center text-nowrap text-white">2</p>
    </div>
  );
}

function CardProduitLeadingLgGrayModernState() {
  return (
    <div className="bg-[#ea580c] content-stretch flex gap-[12px] items-center pl-[8px] pr-[12px] py-[4px] relative rounded-[48px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shrink-0" data-name="Card produit/Leading/lg/Gray/Modern/State6">
      <Frame />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#ea580c] text-[14px] text-center text-nowrap">20 kg</p>
    </div>
  );
}

export default function CardProduitLeadingLgGrayModernState1() {
  return (
    <div className="bg-[#f5f5f6] relative rounded-[48px] size-full" data-name="Card produit/Leading/lg/Gray/Modern/State6">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[48px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[2px] pr-[12px] py-[2px] relative size-full">
          <CardProduitLeadingLgGrayModernState />
          <Frame1 />
        </div>
      </div>
    </div>
  );
}