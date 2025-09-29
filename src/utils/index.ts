import { anyPass, isEmpty, isNil } from "ramda";
/**
 * Returns `true` if the given value is its type's empty value, `null` or `undefined`.
 *
 * @func isNilOrEmpty
 * @memberOf Validator
 * @category Validator
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link http://ramdajs.com/docs/#isEmpty|isEmpty}, {@link http://ramdajs.com/docs/#isNil|isNil}
 * @example
 *
 * Validator.isNilOrEmpty([1, 2, 3]); //=> false
 * Validator.isNilOrEmpty([]); //=> true
 * Validator.isNilOrEmpty(''); //=> true
 * Validator.isNilOrEmpty(null); //=> true
 * Validator.isNilOrEmpty(undefined): //=> true
 * Validator.isNilOrEmpty({}); //=> true
 * Validator.isNilOrEmpty({length: 0}); //=> false
 */
export const isNilOrEmpty = anyPass([isNil, isEmpty]);

export const checkImage = (
  imageSrc: string = ""
): Promise<HTMLImageElement | null> => {
  if (isNilOrEmpty(imageSrc)) {
    return Promise.resolve(null);
  }
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("could not load image"));
  });
};

export const basename = (path = "") =>
  !isNilOrEmpty(path)
    ? path
        .split("/")
        .reverse()
        .filter((q) => q.length > 0)[0]
    : path;

export const fileExtension = (file = "") =>
  !isNilOrEmpty(file) ? file.split(".").pop() : file;

export const isArrayNotEmpty = (arr: any[]) =>
  Array.isArray(arr) && arr.length > 0;
