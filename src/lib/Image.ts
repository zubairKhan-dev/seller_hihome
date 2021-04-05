const CND_PATH = 'https://d2wirx2fde5hbu.cloudfront.net/fit-in/';

export function generateImageURL(path, width = 0, height = 0) {
    let image_url = CND_PATH;

    if(width > 0 & height > 0){
      image_url += width +"x"+ height;
    }

    return image_url +"/"+ path;
}
