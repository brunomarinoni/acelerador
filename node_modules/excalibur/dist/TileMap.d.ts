import { BoundingBox } from './Collision/BoundingBox';
import { Class } from './Class';
import { Engine } from './Engine';
import { Vector } from './Algebra';
import { Actor } from './Actor';
import { Logger } from './Util/Log';
import { SpriteSheet } from './Drawing/SpriteSheet';
import * as Events from './Events';
/**
 * @hidden
 */
export declare class TileMapImpl extends Class {
    private _collidingX;
    private _collidingY;
    private _onScreenXStart;
    private _onScreenXEnd;
    private _onScreenYStart;
    private _onScreenYEnd;
    private _spriteSheets;
    logger: Logger;
    data: Cell[];
    x: number;
    y: number;
    cellWidth: number;
    cellHeight: number;
    rows: number;
    cols: number;
    on(eventName: Events.preupdate, handler: (event?: Events.PreUpdateEvent) => void): void;
    on(eventName: Events.postupdate, handler: (event?: Events.PostUpdateEvent) => void): void;
    on(eventName: Events.predraw, handler: (event?: Events.PreDrawEvent) => void): void;
    on(eventName: Events.postdraw, handler: (event?: Events.PostDrawEvent) => void): void;
    on(eventName: string, handler: (event?: Events.GameEvent<any>) => void): void;
    /**
     * @param x             The x coordinate to anchor the TileMap's upper left corner (should not be changed once set)
     * @param y             The y coordinate to anchor the TileMap's upper left corner (should not be changed once set)
     * @param cellWidth     The individual width of each cell (in pixels) (should not be changed once set)
     * @param cellHeight    The individual height of each cell (in pixels) (should not be changed once set)
     * @param rows          The number of rows in the TileMap (should not be changed once set)
     * @param cols          The number of cols in the TileMap (should not be changed once set)
     */
    constructor(xOrConfig: number | TileMapArgs, y: number, cellWidth: number, cellHeight: number, rows: number, cols: number);
    registerSpriteSheet(key: string, spriteSheet: SpriteSheet): void;
    /**
     * Returns the intersection vector that can be used to resolve collisions with actors. If there
     * is no collision null is returned.
     */
    collides(actor: Actor): Vector;
    /**
     * Returns the [[Cell]] by index (row major order)
     */
    getCellByIndex(index: number): Cell;
    /**
     * Returns the [[Cell]] by its x and y coordinates
     */
    getCell(x: number, y: number): Cell;
    /**
     * Returns the [[Cell]] by testing a point in global coordinates,
     * returns `null` if no cell was found.
     */
    getCellByPoint(x: number, y: number): Cell;
    update(engine: Engine, delta: number): void;
    /**
     * Draws the tile map to the screen. Called by the [[Scene]].
     * @param ctx    The current rendering context
     * @param delta  The number of milliseconds since the last draw
     */
    draw(ctx: CanvasRenderingContext2D, delta: number): void;
    /**
     * Draws all the tile map's debug info. Called by the [[Scene]].
     * @param ctx  The current rendering context
     */
    debugDraw(ctx: CanvasRenderingContext2D): void;
}
/**
 * [[include:Constructors.md]]
 */
export interface TileMapArgs extends Partial<TileMapImpl> {
    x: number;
    y: number;
    cellWidth: number;
    cellHeight: number;
    rows: number;
    cols: number;
}
declare const TileMap_base: typeof TileMapImpl;
/**
 * The [[TileMap]] class provides a lightweight way to do large complex scenes with collision
 * without the overhead of actors.
 *
 * [[include:TileMaps.md]]
 */
export declare class TileMap extends TileMap_base {
    constructor(config: TileMapArgs);
    constructor(x: number, y: number, cellWidth: number, cellHeight: number, rows: number, cols: number);
}
/**
 * Tile sprites are used to render a specific sprite from a [[TileMap]]'s spritesheet(s)
 */
export declare class TileSprite {
    spriteSheetKey: string;
    spriteId: number;
    /**
     * @param spriteSheetKey  The key of the spritesheet to use
     * @param spriteId        The index of the sprite in the [[SpriteSheet]]
     */
    constructor(spriteSheetKey: string, spriteId: number);
}
/**
 * @hidden
 */
export declare class CellImpl {
    private _bounds;
    x: number;
    y: number;
    width: number;
    height: number;
    index: number;
    solid: boolean;
    sprites: TileSprite[];
    /**
     * @param x       Gets or sets x coordinate of the cell in world coordinates
     * @param y       Gets or sets y coordinate of the cell in world coordinates
     * @param width   Gets or sets the width of the cell
     * @param height  Gets or sets the height of the cell
     * @param index   The index of the cell in row major order
     * @param solid   Gets or sets whether this cell is solid
     * @param sprites The list of tile sprites to use to draw in this cell (in order)
     */
    constructor(xOrConfig: number | CellArgs, y: number, width: number, height: number, index: number, solid?: boolean, sprites?: TileSprite[]);
    /**
     * Returns the bounding box for this cell
     */
    getBounds(): BoundingBox;
    /**
     * Gets the center coordinate of this cell
     */
    getCenter(): Vector;
    /**
     * Add another [[TileSprite]] to this cell
     */
    pushSprite(tileSprite: TileSprite): void;
    /**
     * Remove an instance of [[TileSprite]] from this cell
     */
    removeSprite(tileSprite: TileSprite): void;
    /**
     * Clear all sprites from this cell
     */
    clearSprites(): void;
}
/**
 * [[include:Constructors.md]]
 */
export interface CellArgs extends Partial<CellImpl> {
    x: number;
    y: number;
    width: number;
    height: number;
    index: number;
    solid?: boolean;
    sprites?: TileSprite[];
}
declare const Cell_base: typeof CellImpl;
/**
 * TileMap Cell
 *
 * A light-weight object that occupies a space in a collision map. Generally
 * created by a [[TileMap]].
 *
 * Cells can draw multiple sprites. Note that the order of drawing is the order
 * of the sprites in the array so the last one will be drawn on top. You can
 * use transparency to create layers this way.
 */
export declare class Cell extends Cell_base {
    constructor(config: CellArgs);
    constructor(x: number, y: number, width: number, height: number, index: number, solid?: boolean, sprites?: TileSprite[]);
}
export {};
