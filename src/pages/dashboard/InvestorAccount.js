import React from 'react';
import { useDispatch, useSelector } from '../../redux/store';

export default function InvestorAccount() {
  const queryParams = new URLSearchParams(window.location.search);

  const id = parseInt(queryParams.get('id'), 10);

  const { investors } = useSelector((state) => state.investors);

  const currentInvestor = investors.find((period) => period.id === id);

  return <div>InvestorAccount</div>;
}
