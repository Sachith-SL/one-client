import type { Department } from "./Department";

export interface Employee {
  id: number;
  name: string;
  department: Department;
  salary: number;
}
