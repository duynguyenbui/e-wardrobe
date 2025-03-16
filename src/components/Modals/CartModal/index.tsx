'use client'

import ProductVariantCard from '@/components/ProductVariantCard'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useCart } from '@/stores/useCart'
import { useModals } from '@/stores/useModals'
import { ModalType } from '@/types'
import { Fragment, useState } from 'react'

export const CartModal = () => {
  const { isOpen, type, close, data } = useModals()
  const { add } = useCart()
  const [quantityToBuy, setQuantityToBuy] = useState(1)

  const addToCart = () => {
    if (data) {
      add({ ...data, quantityToBuy })
      close()
    }
  }

  console.log(data)
  return (
    <Dialog open={type === ModalType.ADD_TO_CART && isOpen} onOpenChange={close}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle className="text-center text-2xl font-bold">Thêm vào giỏ hàng</DialogTitle>
        <DialogDescription>
          Thêm sản phẩm này vào giỏ hàng. Bạn có thể điều chỉnh số lượng trong giỏ hàng trước khi
          thanh toán
        </DialogDescription>
        {data && (
          <Fragment>
            <div className="mt-4">
              <ProductVariantCard productVariant={data} showImage />
            </div>
            <div className="mt-4 flex items-center gap-4">
              <Input
                type="number"
                max={data.quantity}
                value={quantityToBuy}
                onChange={(e) =>
                  setQuantityToBuy(Math.max(1, Number.parseInt(e.target.value) || 1))
                }
                className="w-20"
              />
              <Button onClick={addToCart} className="flex-grow">
                Thêm vào giỏ hàng
              </Button>
            </div>
          </Fragment>
        )}
      </DialogContent>
    </Dialog>
  )
}
