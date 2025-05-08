import {PrivyClient} from '@privy-io/server-auth';
import { PRIVY_APP_ID, PRIVY_APP_SECRET } from '.';

const privy = new PrivyClient(PRIVY_APP_ID, PRIVY_APP_SECRET);

export default privy;