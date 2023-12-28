export type BaseResponseType<D = {}> = {
  resultCode: number
  messages: string[]
  data: D
  fieldsErrors: FieldErrorType[]
}
export type FieldErrorType = {
  error: string
  field: string
}
