import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const { data: { amount: stockAmount } } = await api.get(`stock/${productId}`);
      const existingProductInCart = cart.find(product => product.id === productId);

      if(existingProductInCart && existingProductInCart.amount + 1 > stockAmount){
        toast.error('Quantidade solicitada fora de estoque');
        return; 
      }

      if(stockAmount && stockAmount>0){
        const { data: productData } = await api.get(`products/${productId}`);
        const cartProduct = {
         ...productData,
          amount: 1
        };
        let newCartList = [...cart, cartProduct];

        if(existingProductInCart){
          newCartList = cart.map(
            product => product.id === productId ? 
            {...product, amount: product.amount+1} : product
          );
        }

        localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCartList));
        setCart(newCartList);
      }
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
