export default class AnimatableComponent {
    /**
     * All components inherit this and required to have a this.animations object
     * basically adds a class to component to animate it and removes after timeout
     * or doesnt remove if manual reset set to true
     */
    protected playAnimation(animation: string, time: number, callback?: any, manualReset?: boolean): void {
        this['animations'][animation] = true;

        setTimeout(() => {
            // reset animation
            if (!manualReset) {
                this['animations'][animation] = false;
            }

            // call if defined
            if (callback) {
                callback();
            }
        }, time);
    }
};
