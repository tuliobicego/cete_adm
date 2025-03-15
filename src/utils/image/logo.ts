async function carregarImagemSVGParaBase64(url: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const reader = new FileReader();

            reader.onloadend = () => {
                const img = new Image();
                img.src = reader.result as string;
                img.onload = () => {
                    // Criando um canvas para desenhar o SVG
                    const canvas = document.createElement("canvas");
                    canvas.width = img.width || 200; // Define um tamanho padrão caso o SVG não tenha width/height
                    canvas.height = img.height || 200;
                    
                    const ctx = canvas.getContext("2d");

                    if (!ctx) {
                        reject("Erro ao criar contexto do canvas");
                        return;
                    }

                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL("image/png")); // Converter para PNG Base64
                };
                img.onerror = (err) => reject("Erro ao carregar imagem SVG: " + err);
            };
            reader.onerror = (err) => reject("Erro ao ler arquivo SVG: " + err);
            reader.readAsDataURL(blob);
        } catch (error) {
            reject("Erro ao buscar SVG: " + error);
        }
    });
}

export default carregarImagemSVGParaBase64