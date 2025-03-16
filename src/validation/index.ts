import { z } from 'zod'

export const PayloadUserLoginValidator = z.object({
  email: z.string().email(),
  password: z.string().min(1, {
    message: 'Mật khẩu không được để trống.',
  }),
})

export const PayloadUserSignUpValidator = z.object({
  email: z.string().email(),
  password: z.string().min(3, {
    message: 'Mật khẩu phải có ít nhất 3 ký tự.',
  }),
  name: z.string().min(1, {
    message: 'Tên không được để trống.',
  }),
})

export const PayloadUserSettingsValidator = z.object({
  email: z.string().email(),
  password: z.string().optional(),
  name: z.string().min(1, {
    message: 'Tên không được để trống.',
  }),
})

export const CreateAddressValidator = z.object({
  name: z.string().min(1, {
    message: 'Tên không được để trống.',
  }),
  province: z.string().min(1, {
    message: 'Tỉnh không được để trống.',
  }),
  district: z.string().min(1, {
    message: 'Quận/Huyện không được để trống.',
  }),
  ward: z.string().min(1, {
    message: 'Phường/Xã không được để trống.',
  }),
  contactName: z.string().min(1, {
    message: 'Tên liên hệ không được để trống.',
  }),
  contactPhone: z.string().min(1, {
    message: 'Số điện thoại liên hệ không được để trống.',
  }),
  detailAddress: z.string().min(1, {
    message: 'Địa chỉ chi tiết không được để trống.',
  }),
})

export const UserRecommedSizeValidator = z.object({
  height: z.number().min(100),
  weight: z.number().min(20),
})

export const CreateOrderValidator = z.object({
  userId: z.string().min(1, {
    message: 'Người dùng không được để trống.',
  }),
  addressId: z.string().min(1, {
    message: 'Vui lòng chọn địa chỉ hoặc tạo mới.',
  }),
  lineItems: z.array(
    z.object({
      productVariantId: z.string().min(1, {
        message: 'Biến thể sản phẩm không được để trống.',
      }),
      quantityToBuy: z.number().min(1, {
        message: 'Số lượng phải lớn hơn 0.',
      }),
    }),
  ),
  couponId: z.string().optional(),
  note: z.string().optional(),
  type: z.enum(['online', 'cod']),
})

export type TCreateOrderValidator = z.infer<typeof CreateOrderValidator>
export type TUserRecommedSizeValidator = z.infer<typeof UserRecommedSizeValidator>
export type TCreateAddressValidator = z.infer<typeof CreateAddressValidator>
export type TPayloadUserLoginValidator = z.infer<typeof PayloadUserLoginValidator>
export type TPayloadUserSignUpValidator = z.infer<typeof PayloadUserSignUpValidator>
export type TPayloadUserSettingsValidator = z.infer<typeof PayloadUserSettingsValidator>
