import {createContext} from 'react';
import { toChangeCurrentUser } from '../types';

type AppContextType ={
    toChangeCurrentUser: toChangeCurrentUser;
}

export const AppContext = createContext<AppContextType | null>(null);