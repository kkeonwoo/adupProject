import React, { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import uuid from 'react-uuid';

export default function NavDepth01() {
    const { data: category } = useQuery(['category'], async () => {
        return axios.get('/data/buygo_product.json')
        .then((res) => res.data)
        .then((items) => items.map((item) => {
                return item.category;
        }))
    })
    
    return (
        <div className='depth1_area'>
            <ul className="depth1_list">
                { category && category.map((item, idx) => {
                    return category.indexOf(item) === idx && <li key={uuid()}>{item}</li>
                })}
            </ul>
        </div>
    );
}