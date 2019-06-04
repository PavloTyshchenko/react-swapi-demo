import React, { Component } from 'react';

import Spinner from '../spinner';
import ErrorButton from '../error-button';

import './item-details.css';


const Record = ({ item, field, label }) => {
    return (
        <li className="list-group-item">
            <span className="term">{label}</span>
            <span>{item[field]}</span>
        </li>
    );
};

export {
    Record
};


export default class ItemDetails extends Component {

    state = {
        item: null,
        image: null,
        loading: false
    };

    componentDidMount() {
        this.updateItem();
    }

    componentDidUpdate(prevProps) {
        if (this.props.itemId !== prevProps.itemId) {
            this.updateItem();
        }
    }

    updateItem() {
        const { itemId, getData, getImageUrl } = this.props; 
        if (!itemId) {
            return;
        }

        this.setState({
            loading: true
        });

        getData(itemId)
            .then((item) => {
                this.setState({
                    item,
                    image: getImageUrl(item),
                    loading: false
                });
            });
    };

    render() {

        const { item, image, loading } = this.state;
        const children = React.Children.map(this.props.children, (child) => {
            return React.cloneElement(child, { item });
        });

        const hasData = (!item) ? <span>Select an item from a list</span> : null;

        const spinner = loading ? <Spinner /> : null;
        const content = (!loading && item) ? <ItemView item={item} image={image} children={children} /> : null;

        return (
            <div className="item-details card">
                {hasData}
                {spinner}
                {content}
            </div>
        );
    }
}

const ItemView = ({ item, image, children }) => {

    const { name } = item;

    return (
        <React.Fragment>
            <img className="item-image"
                src={image}
                alt="Item" />

            <div className="card-body">
                <h4>{name}</h4>
                <ul className="list-group list-group-flush">
                    {children}
                </ul>
                <ErrorButton />
            </div>
        </React.Fragment>
    );
}
