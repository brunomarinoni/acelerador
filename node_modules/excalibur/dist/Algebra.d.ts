import { Engine } from './Engine';
/**
 * A 2D vector on a plane.
 */
export declare class Vector {
    x: number;
    y: number;
    /**
     * A (0, 0) vector
     */
    static readonly Zero: Vector;
    /**
     * A (1, 1) vector
     */
    static readonly One: Vector;
    /**
     * A (0.5, 0.5) vector
     */
    static readonly Half: Vector;
    /**
     * A unit vector pointing up (0, -1)
     */
    static readonly Up: Vector;
    /**
     * A unit vector pointing down (0, 1)
     */
    static readonly Down: Vector;
    /**
     * A unit vector pointing left (-1, 0)
     */
    static readonly Left: Vector;
    /**
     * A unit vector pointing right (1, 0)
     */
    static readonly Right: Vector;
    /**
     * Returns a vector of unit length in the direction of the specified angle in Radians.
     * @param angle The angle to generate the vector
     */
    static fromAngle(angle: number): Vector;
    /**
     * Checks if vector is not null, undefined, or if any of its components are NaN or Infinity.
     */
    static isValid(vec: Vector): boolean;
    /**
     * Calculates distance between two Vectors
     * @param vec1
     * @param vec2
     */
    static distance(vec1: Vector, vec2: Vector): number;
    /**
     * @param x  X component of the Vector
     * @param y  Y component of the Vector
     */
    constructor(x: number, y: number);
    /**
     * Sets the x and y components at once
     */
    setTo(x: number, y: number): void;
    /**
     * Compares this point against another and tests for equality
     * @param point  The other point to compare to
     */
    equals(vector: Vector, tolerance?: number): boolean;
    /**
     * The distance to another vector. If no other Vector is specified, this will return the [[magnitude]].
     * @param v  The other vector. Leave blank to use origin vector.
     */
    distance(v?: Vector): number;
    /**
     * The magnitude (size) of the Vector
     */
    magnitude(): number;
    /**
     * Normalizes a vector to have a magnitude of 1.
     */
    normalize(): Vector;
    /**
     * Returns the average (midpoint) between the current point and the specified
     */
    average(vec: Vector): Vector;
    /**
     * Scales a vector's by a factor of size
     * @param size  The factor to scale the magnitude by
     */
    scale(size: number): Vector;
    /**
     * Adds one vector to another
     * @param v The vector to add
     */
    add(v: Vector): Vector;
    /**
     * Subtracts a vector from another, if you subract vector `B.sub(A)` the resulting vector points from A -> B
     * @param v The vector to subtract
     */
    sub(v: Vector): Vector;
    /**
     * Adds one vector to this one modifying the original
     * @param v The vector to add
     */
    addEqual(v: Vector): Vector;
    /**
     * Subtracts a vector from this one modifying the original
     * @parallel v The vector to subtract
     */
    subEqual(v: Vector): Vector;
    /**
     * Scales this vector by a factor of size and modifies the original
     */
    scaleEqual(size: number): Vector;
    /**
     * Performs a dot product with another vector
     * @param v  The vector to dot
     */
    dot(v: Vector): number;
    /**
     * Performs a 2D cross product with scalar. 2D cross products with a scalar return a vector.
     * @param v  The scalar to cross
     */
    cross(v: number): Vector;
    /**
     * Performs a 2D cross product with another vector. 2D cross products return a scalar value not a vector.
     * @param v  The vector to cross
     */
    cross(v: Vector): number;
    /**
     * Returns the perpendicular vector to this one
     */
    perpendicular(): Vector;
    /**
     * Returns the normal vector to this one, same as the perpendicular of length 1
     */
    normal(): Vector;
    /**
     * Negate the current vector
     */
    negate(): Vector;
    /**
     * Returns the angle of this vector.
     */
    toAngle(): number;
    /**
     * Rotates the current vector around a point by a certain number of
     * degrees in radians
     */
    rotate(angle: number, anchor?: Vector): Vector;
    /**
     * Creates new vector that has the same values as the previous.
     */
    clone(): Vector;
    /**
     * Returns a string repesentation of the vector.
     */
    toString(): string;
}
/**
 * A 2D ray that can be cast into the scene to do collision detection
 */
export declare class Ray {
    pos: Vector;
    dir: Vector;
    /**
     * @param pos The starting position for the ray
     * @param dir The vector indicating the direction of the ray
     */
    constructor(pos: Vector, dir: Vector);
    /**
     * Tests a whether this ray intersects with a line segment. Returns a number greater than or equal to 0 on success.
     * This number indicates the mathematical intersection time.
     * @param line  The line to test
     */
    intersect(line: Line): number;
    /**
     * Returns the point of intersection given the intersection time
     */
    getPoint(time: number): Vector;
}
/**
 * A 2D line segment
 */
export declare class Line {
    begin: Vector;
    end: Vector;
    /**
     * @param begin  The starting point of the line segment
     * @param end  The ending point of the line segment
     */
    constructor(begin: Vector, end: Vector);
    /**
     * Gets the raw slope (m) of the line. Will return (+/-)Infinity for vertical lines.
     */
    readonly slope: number;
    /**
     * Gets the Y-intercept (b) of the line. Will return (+/-)Infinity if there is no intercept.
     */
    readonly intercept: number;
    /**
     * Gets the normal of the line
     */
    normal(): Vector;
    /**
     * Returns the slope of the line in the form of a vector
     */
    getSlope(): Vector;
    /**
     * Returns the length of the line segment in pixels
     */
    getLength(): number;
    /**
     * Find the perpendicular distance from the line to a point
     * https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
     * @param point
     */
    distanceToPoint(point: Vector): number;
    /**
     * Finds a point on the line given only an X or a Y value. Given an X value, the function returns
     * a new point with the calculated Y value and vice-versa.
     *
     * @param x The known X value of the target point
     * @param y The known Y value of the target point
     * @returns A new point with the other calculated axis value
     */
    findPoint(x?: number, y?: number): Vector;
    /**
     * Whether or not the given point lies on this line. This method is precise by default
     * meaning the point must lie exactly on the line. Adjust threshold to
     * loosen the strictness of the check for floating-point calculations.
     */
    hasPoint(x: number, y: number, threshold?: number): boolean;
    /**
     * Whether or not the given point lies on this line. This method is precise by default
     * meaning the point must lie exactly on the line. Adjust threshold to
     * loosen the strictness of the check for floating-point calculations.
     */
    hasPoint(v: Vector, threshold?: number): boolean;
}
/**
 * A 1 dimensional projection on an axis, used to test overlaps
 */
export declare class Projection {
    min: number;
    max: number;
    constructor(min: number, max: number);
    overlaps(projection: Projection): boolean;
    getOverlap(projection: Projection): number;
}
export declare class GlobalCoordinates {
    worldPos: Vector;
    pagePos: Vector;
    screenPos: Vector;
    static fromPagePosition(x: number, y: number, engine: Engine): GlobalCoordinates;
    static fromPagePosition(pos: Vector, engine: Engine): GlobalCoordinates;
    constructor(worldPos: Vector, pagePos: Vector, screenPos: Vector);
}
