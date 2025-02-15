document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("canvas");
    const images = document.querySelectorAll(".draggable");

    images.forEach(img => {
        img.addEventListener("dragstart", function (e) {
            e.dataTransfer.setData("src", e.target.src);
        });
    });

    canvas.addEventListener("dragover", function (e) {
        e.preventDefault();
    });

    canvas.addEventListener("drop", function (e) {
        e.preventDefault();
        const imgSrc = e.dataTransfer.getData("src");
        const newImg = document.createElement("img");
        newImg.src = imgSrc;
        newImg.classList.add("resizable");
        newImg.style.position = "absolute";
        newImg.style.left = `${e.clientX - canvas.offsetLeft}px`;
        newImg.style.top = `${e.clientY - canvas.offsetTop}px`;
        newImg.style.width = "100px";
        newImg.style.maxWidth = `${canvas.clientWidth - 10}px`;
        newImg.style.maxHeight = `${canvas.clientHeight - 10}px`;
        canvas.appendChild(newImg);

        makeDraggableResizable(newImg);
    });

    function makeDraggableResizable(element) {
        interact(element)
            .draggable({
                modifiers: [
                    interact.modifiers.restrictRect({
                        restriction: "#canvas",
                        endOnly: true
                    })
                ],
                listeners: {
                    move(event) {
                        const target = event.target;
                        const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
                        const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

                        target.style.transform = `translate(${x}px, ${y}px)`;
                        target.setAttribute("data-x", x);
                        target.setAttribute("data-y", y);
                    }
                }
            })
            .resizable({
                edges: { left: true, right: true, bottom: true, top: true },
                modifiers: [
                    interact.modifiers.restrictSize({
                        max: { width: canvas.clientWidth, height: canvas.clientHeight }
                    })
                ],
                listeners: {
                    move(event) {
                        let { x, y } = event.target.dataset;

                        x = (parseFloat(x) || 0) + event.deltaRect.left;
                        y = (parseFloat(y) || 0) + event.deltaRect.top;

                        Object.assign(event.target.style, {
                            width: `${event.rect.width}px`,
                            height: `${event.rect.height}px`,
                            transform: `translate(${x}px, ${y}px)`
                        });

                        Object.assign(event.target.dataset, { x, y });
                    }
                }
            });
    }

    document.getElementById("clear").addEventListener("click", function () {
        canvas.innerHTML = "";
    });
});