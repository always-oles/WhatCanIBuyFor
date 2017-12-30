export default class AnimatableComponent {
    protected playAnimation(animation: string, time: number): void {
        this[animation] = true;
        setTimeout(() => this[animation] = false, time);
    }
}