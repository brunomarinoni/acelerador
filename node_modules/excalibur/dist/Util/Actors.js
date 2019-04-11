import { UIActor } from '../UIActor';
import { Label } from '../Label';
import { Trigger } from '../Trigger';
export function isVanillaActor(actor) {
    return !(actor instanceof UIActor) && !(actor instanceof Trigger) && !(actor instanceof Label);
}
export function isUIActor(actor) {
    return actor instanceof UIActor;
}
//# sourceMappingURL=Actors.js.map