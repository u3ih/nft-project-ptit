import { useEffect, useState } from 'react';
import React from "react";
import { HiTag } from 'react-icons/hi';
import { IoMdWallet } from 'react-icons/io';
import toast, { Toaster } from 'react-hot-toast';

const MakeOffer = (props: any) => {
  const [selectedMarketNft, setSelectedMarketNft] = useState<any>()
  const [enableButton, setEnableButton] = useState(false)
  const { isListed, selectedNft, listings, marketPlaceModule } = props;

  useEffect(() => {
    if (!listings || isListed === 'false') return
      ; (async () => {
        setSelectedMarketNft(
          listings.find((marketNft: any) => marketNft?.asset?.id === selectedNft?.id)
        )
      })()
  }, [selectedNft, listings, isListed])

  useEffect(() => {
    if (!selectedMarketNft || !selectedNft) return

    setEnableButton(true)
  }, [selectedMarketNft, selectedNft])

  const confirmPurchase = (toastHandler = toast) =>
    toastHandler.success(`Purchase successful!`, {
      style: {
        background: '#04111d',
        color: '#fff',
      },
    })

  const buyItem = async (
    listingId = selectedMarketNft?.id,
    quantityDesired = 1,
    module = marketPlaceModule
  ) => {
    console.log(listingId, quantityDesired, module, 'david')
    await module
      .buyoutDirectListing({
        listingId: listingId,
        quantityDesired: quantityDesired,
      })
      .catch((error: any) => console.error(error))

    confirmPurchase()
  }

  return (
    <div className="flex h-20 w-full items-center rounded-lg border border-[#151c22] bg-[#303339] px-12">
      <Toaster position="bottom-left" reverseOrder={false} />
      {isListed === 'true' ? (
        <>
          <div
            onClick={() => {
              enableButton ? buyItem(selectedMarketNft?.id, 1) : null
            }}
            className={"mr-8 flex items-center py-2 px-12 rounded-lg cursor-pointer bg-[#2081e2] hover:bg-[#42a0ff]"}
          >
            <IoMdWallet className={"text-xl"} />
            <div className={"ml-2 text-lg font-semibold"}>Buy Now</div>
          </div>
          <div
            className={"mr-8 flex items-center py-2 px-12 rounded-lg cursor-pointer border border-[#151c22]  bg-[#363840] hover:bg-[#4c505c]"}
          >
            <HiTag className={"text-xl"} />
            <div className={"ml-2 text-lg font-semibold"}>Make Offer</div>
          </div>
        </>
      ) : (
        <div className={"mr-8 flex items-center py-2 px-12 rounded-lg cursor-pointer bg-[#2081e2] hover:bg-[#42a0ff]"}>
          <IoMdWallet className={"text-xl"} />
          <div className={"ml-2 text-lg font-semibold"}>List Item</div>
        </div>
      )}
    </div>
  )
}

export default MakeOffer
