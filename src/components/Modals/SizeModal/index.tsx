'use client'

import { useCallback, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Size } from '@/payload-types'
import { recommendSizes } from '@/actions/sizes'
import { toast } from 'sonner'
import { Ruler, Weight } from 'lucide-react'
import { useModals } from '@/stores/useModals'
import { ModalType } from '@/types'
import Spinner from '@/components/Spinner'

export const SizeSelectorModal = () => {
  const { isOpen, type, close } = useModals()
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [sizes, setSizes] = useState<Pick<Size, 'id' | 'name' | 'description'>[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = useCallback(async () => {
    if (!height || !weight) {
      toast.error('Vui lòng nhập cả chiều cao và cân nặng')
      return
    }

    setIsLoading(true)
    try {
      const { success, data, message } = await recommendSizes({
        height: Number(height),
        weight: Number(weight),
      })

      if (success && data) {
        setSizes(data)
        toast.success(message)
      } else {
        setSizes([])
        toast.error(message)
      }
    } catch (_) {
      setSizes([])
      toast.error('Đã xảy ra lỗi khi tính toán kích thước')
    } finally {
      setIsLoading(false)
    }
  }, [weight, height])

  return (
    <Dialog open={type === ModalType.SIZE_SELECTOR && isOpen} onOpenChange={close}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle className="text-center text-2xl font-bold">Chọn Size</DialogTitle>
        <div className="mt-4">
          <p className="text-center text-sm text-muted-foreground">
            Nhập số đo của bạn để nhận được gợi ý size phù hợp
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onSubmit()
            }}
            className="mt-6 space-y-6"
          >
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="height" className="flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  Chiều cao (cm)
                </Label>
                <Input
                  id="height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  type="number"
                  min="0"
                  className="text-center"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight" className="flex items-center gap-2">
                  <Weight className="w-4 h-4" />
                  Cân nặng (kg)
                </Label>
                <Input
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  type="number"
                  min="0"
                  className="text-center"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Spinner /> : 'Tính Size'}
            </Button>
          </form>
        </div>
        {sizes.length > 0 && (
          <div className="w-full space-y-4 mt-6">
            <h3 className="text-lg font-semibold text-center">Size Được Đề Xuất</h3>
            {sizes.map((size) => (
              <div key={size.id} className="bg-secondary p-4 rounded-md">
                <h4 className="font-medium">{size.name}</h4>
                <p className="text-sm text-muted-foreground">{size.description}</p>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
