
import * as SecureStore from 'expo-secure-store';

export const getValueFromStorage = async (key: string): Promise<string | null> => {
    let res = null;
    try {
    res = await SecureStore.getItemAsync(key)
    } catch (error) {
        console.log('Error in storing item');
    }
    return res;
}

export const setValueInStorage = async (key: string, value: string) => {
    try {
        await SecureStore.setItemAsync(key, value)
    } catch (error) {
        console.log('Error in storing item');
    }
}

export const removeValuefromStorage = async (key: string) => {
    try {
        await SecureStore.deleteItemAsync(key)
    } catch (error) {
        console.log('Error in storing item');
    }
}