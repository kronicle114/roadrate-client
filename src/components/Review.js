import React, { useState } from 'react';
// import Plate from './plate';
import Spinner from 'react-spinkit';
import { Link, Redirect } from 'react-router-dom';
// import isLoggedIn from '../../helpers/is_logged_in';

import '../styles/reviews.css';

import { Icon } from 'react-materialize';

export const Review = (props) => {

    // const imgSrc = '/';
    //if an image is uploaded by a user then it will be included in the review, otherwise no image will be displayed
    // if(review.img) {
    //   imgSrc = review.img;
    // }

    const [redirect, setRedirect] = useState(false);

    const { searchReviews, searchInput } = props;
    const reviews = props.reviews;
    console.log('props on Review component: ', props);

    //Setting the time up for todays date
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }
    
    if (mm < 10) {
      mm = '0' + mm;
    }

    today = `${mm}/${dd}/${yyyy}`

    let review = (
      <div className="spinner" style={{}}>
        <Spinner name="line-spin-fade-loader" color="green"/>
      </div>
    )

    let rating;
    let driverComment;
    if (reviews) {
       review = reviews.map((review, index) => { 
        if (review.isPositive === 'true') {
          rating = <Icon>thumb_up</Icon>
        } else {
          rating = <Icon>thumb_down</Icon>
        }

        if (review.comment) {
          driverComment = <p> Driver Response: {review.comment}</p>
        } 

        if (redirect === true) {
          return (
            <Redirect to={{
              pathname: '/plate',
              state: {plateNumber: props.plateNumber},
            }}
            push={true}
            />
          )}

        const handleClick = (e) => {
          e.preventDefault();
          setRedirect(true);
        }
    
        return (
          <li className='review-item' key={review._id} tabIndex='0'>
            <article className='review-header'>
              <article className='review-title'>
                <img className='isClaimed-icon' src='https://cdn4.iconfinder.com/data/icons/flatastic-11-1/256/user-green-512.png' alt='green user icon'></img>
                
                <p id='review-time'>{today}</p>
              </article>
              <a class="waves-effect waves-light btn-small" onClick={handleClick}> {review.plateNumber}</a>
              <article className='review-rating'>
                <p className='rating'>{rating}</p>
              </article>
            </article>
            {/* <h1 className='plate-number'>{review.plateNumber}</h1><br/> */}
            {/* <img className='review-img' src='https://i.pinimg.com/236x/29/55/38/295538a452d701c9189d0fa8f5b36938--white-truck-bad-parking.jpg' alt='review'></img> */}
            
            {/* Do we want to add information about how long ago this was posted, i.e. 2m or 2h */}
            
            <p className='message'>Review: {review.message}</p>
            <p>{driverComment}</p>
          </li>
        )
      });
    };

    return(
      review
    )
}

export default Review;