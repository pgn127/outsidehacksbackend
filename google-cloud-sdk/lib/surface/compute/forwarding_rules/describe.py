# Copyright 2014 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Command for describing forwarding rules."""
from googlecloudsdk.api_lib.compute import base_classes
from googlecloudsdk.calliope import base
from googlecloudsdk.command_lib.compute import flags as compute_flags
from googlecloudsdk.command_lib.compute.forwarding_rules import flags


class Describe(base.DescribeCommand):
  """Display detailed information about a forwarding rule.

  *{command}* displays all data associated with a forwarding rule
  in a project.

  ## EXAMPLES
  To get details about a global forwarding rule, run:

    $ {command} FORWARDING-RULE --global

  To get details about a regional forwarding rule, run:

    $ {command} FORWARDING-RULE --region us-central1
  """

  FORWARDING_RULE_ARG = None

  @staticmethod
  def Args(parser):
    Describe.FORWARDING_RULE_ARG = flags.ForwardingRuleArgument()
    Describe.FORWARDING_RULE_ARG.AddArgument(parser, operation_type='describe')

  def Run(self, args):
    """Issues request necessary to describe the Forwarding Rule."""
    holder = base_classes.ComputeApiHolder(self.ReleaseTrack())
    client = holder.client

    forwarding_rule_ref = Describe.FORWARDING_RULE_ARG.ResolveAsResource(
        args,
        holder.resources,
        scope_lister=compute_flags.GetDefaultScopeLister(client))

    if forwarding_rule_ref.Collection() == 'compute.forwardingRules':
      service = client.apitools_client.forwardingRules
      request = client.messages.ComputeForwardingRulesGetRequest(
          **forwarding_rule_ref.AsDict())
    elif forwarding_rule_ref.Collection() == 'compute.globalForwardingRules':
      service = client.apitools_client.globalForwardingRules
      request = client.messages.ComputeGlobalForwardingRulesGetRequest(
          **forwarding_rule_ref.AsDict())

    return client.MakeRequests([(service, 'Get', request)])[0]
