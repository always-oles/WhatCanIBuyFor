export default class AnimatableComponent {
    protected playAnimation(animation: string, time: number, callback?: any, manualReset?: boolean): void {
        this[animation] = true;

        setTimeout(() => {
            // reset animation
            if (!manualReset) {
                this[animation] = false;
            }

            // call if defined
            if (callback) {
                callback();
            }
        }, time);
    }
};
