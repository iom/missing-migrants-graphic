
export function spike() {

    let x = 0,
        y = 0,
        width = 0,
        height = 0,
        angle = -90,
        closed = false;
    
    const spike = (datum) => {
        const dx = typeof x === "function" ? x(datum) : x,
            dy = typeof y === "function" ? y(datum) : y,
            dwidth = typeof width === "function" ? width(datum) : width,
            dheight = typeof height === "function" ? height(datum) : height,
            dangle = typeof angle === "function" ? angle(datum) : angle,
            base = [dx, dy],
            a = geometric.pointTranslate(base, dangle - 90, dwidth / 2),
            b = geometric.pointTranslate(base, dangle, dheight),
            c = geometric.pointTranslate(base, dangle + 90, dwidth / 2);      
  
        return closed ? [a, b, c, a] : [a, b, c];    
    }
    
    spike.x = function(n){ return arguments.length ? (x = n, spike) : x; }
    spike.y = function(n){ return arguments.length ? (y = n, spike) : y; }
    spike.width = function(n){ return arguments.length ? (width = n, spike) : width; }
    spike.height = function(n){ return arguments.length ? (height = n, spike) : height; }
    spike.angle = function(n){ return arguments.length ? (angle = n, spike) : angle; }
    spike.closed = function(b){ return arguments.length ? (closed = b, spike) : closed; }
    
    return spike;
};
