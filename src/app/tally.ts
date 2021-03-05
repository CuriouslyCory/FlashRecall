import { DocumentReference } from '@angular/fire/firestore';
import { RecallItem } from './recall-item';

export interface Tally {
    item: DocumentReference<RecallItem>
    lastTalley: Date
    totalTallies: number
    uid: string
}
