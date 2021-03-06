import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ErrorAlert, InfoAlert } from 'pivotal-ui/react/alerts';
import { Collapse } from 'pivotal-ui/react/collapse';
import { Icon } from 'pivotal-ui/react/iconography';
import { ListItem, UnorderedList } from 'pivotal-ui/react/lists';
import { Panel } from 'pivotal-ui/react/panels';
import { selectors, connect } from './resourceRedux';
import k8s from './k8s';

const strings = {
  [k8s.topics.type]: {
    singular: 'topic',
    plural: 'topics'
  },
  [k8s.functions.type]: {
    singular: 'function',
    plural: 'functions'
  }
}

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

class ResourceList extends Component {
  static propTypes = {
    namespace: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    resources: PropTypes.array,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.any,
    children: PropTypes.func
  };

  renderResource(item) {
    const { uid, name } = item.metadata;
    const renderItem = this.props.children;
    return (
      <ListItem key={uid} className='mvl'>
        {renderItem ? renderItem(item) : name}
      </ListItem>
    );
  }

  render() {
    const { type, resources, loading, error } = this.props;

    return (
      <Panel header={capitalize(strings[type].plural)} loading={loading}>
        {loading && !resources ?
          <Icon src='spinner-md' style={{'fontSize': '48px'}} />
        : error ?
          <ErrorAlert withIcon>
            Unable to load {strings[type].plural}.
            <Collapse header='Detail'>
              {'' + error}
            </Collapse>
          </ErrorAlert>
        : resources.length ?
          <UnorderedList unstyled>
            {resources.map(this.renderResource, this)}
          </UnorderedList>
        :
          <InfoAlert withIcon>
            No {strings[type].plural} found
          </InfoAlert>
        }
      </Panel>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { type, namespace } = ownProps;
  return {
    loading: selectors.loading(state, type),
    resources: selectors.listResource(state, type, namespace),
    error: selectors.error(state, type)
  };
}

export default connect(mapStateToProps)(ResourceList);
