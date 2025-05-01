const handleAsyncCases = (builder, thunk,  fulfilledCallback = () => {}) => {
    builder
      .addCase(thunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(thunk.fulfilled, (state, action) => { 
        state.isLoading = false;
        fulfilledCallback(state, action); 
      })
      .addCase(thunk.rejected, (state) => {
        state.isLoading = false;
      });
  };
  
  export default handleAsyncCases;
  