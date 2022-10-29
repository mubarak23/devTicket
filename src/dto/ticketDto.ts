export interface TicketDto {
    name: string ,
    userId: number,
    id?: string | null,
    description?: string | null,
    expiredDate?: string | null,
    numberOfTickets?: number | null,
    isActive?: boolean | null,
  }
  