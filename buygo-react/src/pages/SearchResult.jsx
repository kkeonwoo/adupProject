import React from 'react';

import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import uuid from 'react-uuid';

export default function SearchResult() {
    const { search } = useParams();
    const { 
        isLoading,
        error,
        data: product } = useQuery(['product', search], async () => {
        return axios.get('/data/buygo_product.json')
        .then((res) => res.data)
        .then((items) => items.filter((item) => {
            return item.product.toLowerCase().includes(search);
        }))
    })
    
    return (
        <div>
            <h2>Search Result... 🥗</h2>
            <p>{isLoading && 'is Loading...'}</p>
            <p>{error && 'No matched items'}</p>
            <ul>
                { product && product.map((product) => {
                    return <li key={uuid()}>
                        <h3>{product.product}</h3>
                    </li>
                })}
            </ul>
        </div>
    );
}

