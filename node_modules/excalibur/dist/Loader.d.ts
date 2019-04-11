import { Promise } from './Promises';
import { Engine } from './Engine';
import { Loadable } from './Interfaces/Loadable';
import { CanLoad } from './Interfaces/Loader';
import { Class } from './Class';
/**
 * Pre-loading assets
 *
 * The loader provides a mechanism to preload multiple resources at
 * one time. The loader must be passed to the engine in order to
 * trigger the loading progress bar.
 *
 * The [[Loader]] itself implements [[ILoadable]] so you can load loaders.
 *
 * ## Example: Pre-loading resources for a game
 *
 * ```js
 * // create a loader
 * var loader = new ex.Loader();
 *
 * // create a resource dictionary (best practice is to keep a separate file)
 * var resources = {
 *   TextureGround: new ex.Texture("/images/textures/ground.png"),
 *   SoundDeath: new ex.Sound("/sound/death.wav", "/sound/death.mp3")
 * };
 *
 * // loop through dictionary and add to loader
 * for (var loadable in resources) {
 *   if (resources.hasOwnProperty(loadable)) {
 *     loader.addResource(resources[loadable]);
 *   }
 * }
 *
 * // start game
 * game.start(loader).then(function () {
 *   console.log("Game started!");
 * });
 * ```
 *
 * ## Customize the Loader
 *
 * The loader can be customized to show different, text, logo, background color, and button.
 *
 * ```typescript
 * var loader = new ex.Loader([playerTexture]);
 *
 * // The loaders button text can simply modified using this
 * loader.playButtonText = 'Start the best game ever';
 *
 * // The logo can be changed by inserting a base64 image string here
 *
 * loader.logo = 'data:image/png;base64,iVBORw...';
 * loader.logoWidth = 15;
 * loader.logoHeight = 14;
 *
 * // The background color can be changed like so by supplying a valid CSS color string
 *
 * loader.backgroundColor = 'red'
 * loader.backgroundColor = '#176BAA'
 *
 * // To build a completely new button
 * loader.startButtonFactory = () => {
 *     let myButton = document.createElement('button');
 *     myButton.textContent = 'The best button';
 *     return myButton;
 * };
 *
 * engine.start(loader).then(() => {});
 * ```
 */
export declare class Loader extends Class implements CanLoad {
    private _resourceList;
    private _index;
    private _playButtonShown;
    private _resourceCount;
    private _numLoaded;
    private _progressCounts;
    private _totalCounts;
    private _engine;
    logo: string;
    logoWidth: number;
    logoHeight: number;
    backgroundColor: string;
    protected _imageElement: HTMLImageElement;
    protected readonly _image: HTMLImageElement;
    suppressPlayButton: boolean;
    protected _playButtonRootElement: HTMLElement;
    protected _playButtonElement: HTMLButtonElement;
    protected _styleBlock: HTMLStyleElement;
    /** Loads the css from Loader.css */
    protected _playButtonStyles: string;
    protected readonly _playButton: HTMLButtonElement;
    /**
     * Get/set play button text
     */
    playButtonText: string;
    /**
     * Return a html button element for excalibur to use as a play button
     */
    startButtonFactory: () => HTMLButtonElement;
    /**
     * @param loadables  Optionally provide the list of resources you want to load at constructor time
     */
    constructor(loadables?: Loadable[]);
    wireEngine(engine: Engine): void;
    /**
     * Add a resource to the loader to load
     * @param loadable  Resource to add
     */
    addResource(loadable: Loadable): void;
    /**
     * Add a list of resources to the loader to load
     * @param loadables  The list of resources to load
     */
    addResources(loadables: Loadable[]): void;
    /**
     * Returns true if the loader has completely loaded all resources
     */
    isLoaded(): boolean;
    /**
     * Shows the play button and returns a promise that resolves when clicked
     */
    showPlayButton(): Promise<any>;
    hidePlayButton(): void;
    /**
     * Begin loading all of the supplied resources, returning a promise
     * that resolves when loading of all is complete
     */
    load(): Promise<any>;
    /**
     * Loader draw function. Draws the default Excalibur loading screen.
     * Override `logo`, `logoWidth`, `logoHeight` and `backgroundColor` properties
     * to customize the drawing, or just override entire method.
     */
    draw(ctx: CanvasRenderingContext2D): void;
    /**
     * Perform any calculations or logic in the `update` method. The default `Loader` does not
     * do anything in this method so it is safe to override.
     */
    update(_engine: Engine, _delta: number): void;
    getData: () => any;
    setData: (data: any) => any;
    processData: (data: any) => any;
    onprogress: (e: any) => void;
    oncomplete: () => void;
    onerror: () => void;
}
