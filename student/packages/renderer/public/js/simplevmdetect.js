const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl');
const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL).toLowerCase();
const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();


const keywords = ['vmware','virtualbox','parallels','solarwinds','qemu','hyper-v','bootcamp']


let virtual = false
keywords.forEach( keyword => {
    if (vendor.includes(keyword) ){ virtual = true }
    if (renderer.includes(keyword) ){ virtual = true }
})

export default virtual;

