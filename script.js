class ProductBoard {
    constructor() {
        this.board = document.getElementById('product-board');
        this.sidebar = document.getElementById('sidebar');
        this.deleteBtn = document.getElementById('delete-btn');
        this.removeBgBtn = document.getElementById('remove-bg');
        this.selectedItem = null;
        this.setupDragAndDrop();
        this.setupSampleProducts();
        this.setupSidebar();
        this.setupDeselection();
        this.setupVisualization();
    }

    setupDragAndDrop() {
        this.board.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        this.board.addEventListener('drop', (e) => {
            e.preventDefault();
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            if (data.isNewProduct) {
                const x = e.clientX - this.board.getBoundingClientRect().left;
                const y = e.clientY - this.board.getBoundingClientRect().top;
                this.addProductToBoard(data, x, y);
            }
        });
    }

    setupSampleProducts() {
        const sampleProducts = document.querySelectorAll('.sample-product');
        sampleProducts.forEach(product => {
            product.addEventListener('dragstart', (e) => {
                const productCard = product.closest('.product-card');
                const brandElement = productCard.querySelector('.brand');
                const nameElement = productCard.querySelector('.product-name');
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    imageUrl: product.src,
                    brand: brandElement.textContent,
                    name: nameElement.textContent,
                    isNewProduct: true
                }));
            });
        });
    }

    setupSidebar() {
        this.deleteBtn.addEventListener('click', () => {
            if (this.selectedItem) {
                this.selectedItem.remove();
                this.hideSidebar();
            }
        });

        this.removeBgBtn.addEventListener('click', () => {
            if (this.selectedItem) {
                this.removeBackground(this.selectedItem);
            }
        });
    }

    setupDeselection() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.deselectItem();
            }
        });

        document.addEventListener('mousedown', (e) => {
            if (!this.board.contains(e.target) && !this.sidebar.contains(e.target)) {
                this.deselectItem();
            }
        });
    }

    setupVisualization() {
        const visualizeBtn = document.getElementById('visualize-btn');
        visualizeBtn.addEventListener('click', () => {
            this.visualizeCartItems();
        });
    }

    addProductToBoard(product, x, y) {
        const img = document.createElement('img');
        img.src = product.imageUrl;
        img.alt = `${product.brand} - ${product.name}`;
        img.className = 'product-item';
        img.draggable = false; // Disable native dragging

        img.style.left = `${x - 50}px`;
        img.style.top = `${y - 50}px`;

        img.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // Only respond to left mouse button
            e.preventDefault(); // Prevent image dragging
            this.selectItem(img);
            
            const startX = e.clientX - img.offsetLeft;
            const startY = e.clientY - img.offsetTop;

            const moveHandler = (moveEvent) => {
                const newX = moveEvent.clientX - this.board.getBoundingClientRect().left - startX;
                const newY = moveEvent.clientY - this.board.getBoundingClientRect().top - startY;
                img.style.left = `${newX}px`;
                img.style.top = `${newY}px`;
            };

            const upHandler = () => {
                document.removeEventListener('mousemove', moveHandler);
                document.removeEventListener('mouseup', upHandler);
            };

            document.addEventListener('mousemove', moveHandler);
            document.addEventListener('mouseup', upHandler);
        });

        this.board.appendChild(img);
    }

    selectItem(item) {
        if (this.selectedItem) {
            this.selectedItem.classList.remove('selected');
        }
        this.selectedItem = item;
        item.classList.add('selected');
        this.showSidebar();
    }

    deselectItem() {
        if (this.selectedItem) {
            this.selectedItem.classList.remove('selected');
            this.selectedItem = null;
            this.hideSidebar();
        }
    }

    showSidebar() {
        this.sidebar.classList.remove('hidden');
    }

    hideSidebar() {
        this.sidebar.classList.add('hidden');
    }

    removeBackground(img) {
        console.log('Removing background from', img.alt);
        // Implement your background removal logic here
        // For demonstration, we'll just add a class to change the image style
        img.classList.add('background-removed');
    }

    visualizeCartItems() {
        const cartItems = document.querySelectorAll('.cart-item img');
        cartItems.forEach((item, index) => {
            const x = 50 + (index * 120); // Adjust positioning as needed
            const y = 50;
            this.addProductToBoard({
                imageUrl: item.src,
                brand: 'Cart Item',
                name: item.alt
            }, x, y);
        });
    }

    
}

// Initialize the ProductBoard when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const productBoard = new ProductBoard();
});