import { 
  Patient, 
  PatientType, 
  PriorityMap, 
  Token, 
  TokenStatus, 
  Doctor, 
  TimeSlot 
} from '../types';

export class TokenEngine {
  
  static canAllocate(slot: TimeSlot): boolean {
    const activeTokens = slot.tokens.filter(t => 
      t.status !== TokenStatus.CANCELLED && t.status !== TokenStatus.NO_SHOW
    );
    return activeTokens.length < slot.capacity;
  }

  static getNextTokenId(slot: TimeSlot): number {
    return slot.tokens.length + 1;
  }

  static sortTokens(tokens: Token[]): Token[] {
    return [...tokens].sort((a, b) => {
      const pA = PriorityMap[a.patient.type];
      const pB = PriorityMap[b.patient.type];
      if (pA !== pB) return pA - pB;
      return a.bookedAt - b.bookedAt;
    });
  }

  static allocateToken(
    doctor: Doctor, 
    slotId: string, 
    patientName: string, 
    type: PatientType
  ): { updatedDoctor: Doctor; token?: Token; error?: string } {
    
    const doctorCopy = JSON.parse(JSON.stringify(doctor)) as Doctor;
    const slotIndex = doctorCopy.slots.findIndex(s => s.id === slotId);
    
    if (slotIndex === -1) return { updatedDoctor: doctor, error: 'Slot not found' };
    
    const slot = doctorCopy.slots[slotIndex];

    if (!this.canAllocate(slot) && type !== PatientType.EMERGENCY) {
      return { updatedDoctor: doctor, error: 'Slot is at maximum capacity' };
    }

    const newToken: Token = {
      id: Math.random().toString(36).substring(2, 11),
      tokenId: this.getNextTokenId(slot),
      patient: {
        id: Math.random().toString(36).substring(2, 11),
        name: patientName,
        type: type
      },
      status: TokenStatus.BOOKED,
      slotId: slotId,
      bookedAt: Date.now()
    };

    slot.tokens.push(newToken);
    slot.tokens = this.sortTokens(slot.tokens);

    return { updatedDoctor: doctorCopy, token: newToken };
  }

  static cancelToken(doctor: Doctor, tokenId: string): Doctor {
    const doctorCopy = JSON.parse(JSON.stringify(doctor)) as Doctor;
    for (const slot of doctorCopy.slots) {
      const tokenIndex = slot.tokens.findIndex(t => t.id === tokenId);
      if (tokenIndex !== -1) {
        slot.tokens[tokenIndex].status = TokenStatus.CANCELLED;
        slot.tokens = this.sortTokens(slot.tokens);
        break;
      }
    }
    return doctorCopy;
  }
}