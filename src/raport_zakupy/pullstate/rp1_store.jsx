import { Store, update } from "pullstate";

export const rp1_store = new Store({
  switch1: false,
  isloading: true,
  switch2: false,
  planners: [],
  top_select_target_value: "Mikołaj Chlasta",
});
///zapisz button
export const update_switch1 = () => {
  rp1_store.update((s) => {
    s.switch1 = !s.switch1;
  });
};

export const update_switch2 = (Boolean) => {
  rp1_store.update((s) => {
    s.switch2 = Boolean;
  });
};

export const update_planners = (planners) => {
  rp1_store.update((s) => {
    s.planners = planners;
  });

  console.log("planners ", planners);
};

export const update_top_select_target_value = (value) => {
  rp1_store.update((s) => {
    s.top_select_target_value = value;
  });
  console.log("value ", value);
};

export const update_isloading = (Boolean) => {
  rp1_store.update((s) => {
    s.isloading = Boolean;
  });
};
