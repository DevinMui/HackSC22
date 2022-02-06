import React from 'react';
import styled from 'styled-components';

const Search = styled.input`
  background: #ffffff;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  margin: 8px; padding: 8px;
  padding-left: 16px; 
  padding-right: 16px;
  margin-left: 24px; 
  margin-right: 24px;
  ::placeholder {
      opacity: 0.8
  }
`;

const SearchBar = ({ onSearch, placeholder }) => {
  return <Search type="text" placeholder={placeholder}/>;
};

export default SearchBar;
