import { buildMeta } from '../../common/types';
import { adminRepository } from './admin.repository';

export class AdminService {
  async getDashboard() {
    return adminRepository.getDashboardStats();
  }

  async getLogs(page = 1, limit = 50) {
    const { logs, total, page: p, limit: l } = await adminRepository.getOperationLogs(page, limit);
    return { logs, meta: buildMeta(total, p, l) };
  }
}

export const adminService = new AdminService();
