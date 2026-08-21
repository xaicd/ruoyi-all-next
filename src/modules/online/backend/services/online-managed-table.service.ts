import { KyselyOnlineManagedTableRuntimeRepository } from "../adapters/persistence/online-managed-table-runtime.repository"
import type {
  CreateManagedRecordInput,
  DeleteManagedRecordInput,
  GetManagedRecordInput,
  PageManagedRecordsInput,
  UpdateManagedRecordInput,
} from "../validators"

export class OnlineManagedTableService {
  static pageManagedRecords(input: PageManagedRecordsInput) {
    return KyselyOnlineManagedTableRuntimeRepository.page({ ...input, conditions: input.conditions ?? [] })
  }

  static getManagedRecord(input: GetManagedRecordInput) {
    return KyselyOnlineManagedTableRuntimeRepository.get(input)
  }

  static createManagedRecord(input: CreateManagedRecordInput) {
    return KyselyOnlineManagedTableRuntimeRepository.create(input)
  }

  static updateManagedRecord(input: UpdateManagedRecordInput) {
    return KyselyOnlineManagedTableRuntimeRepository.update(input)
  }

  static deleteManagedRecord(input: DeleteManagedRecordInput) {
    return KyselyOnlineManagedTableRuntimeRepository.delete(input)
  }
}
