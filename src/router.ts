import { useDomain } from '@/composables/useDomain';
import Delegate from '@/views/Delegate.vue';
import Explore from '@/views/Explore.vue';
import GenericDiscordRedirect from '@/views/GenericDiscordRedirect.vue';
import AllGuides from '@/views/Guide/AllGuides.vue';
import CreateGuide from '@/views/Guide/CreateGuide.vue';
import EditGuide from '@/views/Guide/EditGuide.vue';
import Guides from '@/views/Guide/Guides.vue';
import GuideSubmissions from '@/views/Guide/GuideSubmissions.vue';
import GuideBundleCreate from '@/views/GuideBundle/CreateBundle.vue';
import GuideBundles from '@/views/GuideBundle/GuideBundles.vue';
import Home from '@/views/Home.vue';
import Playground from '@/views/Playground.vue';
import Setup from '@/views/Setup.vue';
import Space from '@/views/Space.vue';
import SpaceDiscord from '@/views/Space/Discord.vue';
import SetupSpace from '@/views/Space/SetupSpace.vue';
import SpaceAbout from '@/views/SpaceAbout.vue';
import SpaceCreate from '@/views/SpaceCreate.vue';
import SpaceProposal from '@/views/SpaceProposal.vue';
import SpaceSettings from '@/views/SpaceSettings.vue';
import Strategy from '@/views/Strategy.vue';
import Timeline from '@/views/Timeline.vue';
import { createRouter, createWebHistory, RouteLocation, RouteRecordRaw } from 'vue-router';

// The frontend shows all spaces or just a single one, when being accessed
// through that space's custom domain.
const { domain, alias, siteType } = useDomain();
const routes: RouteRecordRaw[] = [];

// These routes get prefixed with the respective space's ENS domain (/:key)
// or they get mounted at "/" in the single space scenario.

const spaceHomeRoute: RouteRecordRaw =
  siteType === 'courses'
    ? {
        path: '',
        name: 'spaceHome',
        component: GuideBundles,
        props: {
          bundleType: 'courses'
        }
      }
    : {
        path: '',
        name: 'spaceHome',
        component: Guides
      };

const spaceRoutes: RouteRecordRaw[] = [
  spaceHomeRoute,
  {
    path: ':guideType/guides',
    name: 'guides',
    component: Guides
  },
  {
    path: 'all-guides',
    name: 'allGuides',
    component: AllGuides
  },
  {
    path: 'courses',
    name: 'guideBundles',
    component: GuideBundles
  },
  {
    path: 'proposal/:id',
    name: 'spaceProposal',
    component: SpaceProposal
  },
  {
    path: ':guideType/guide/view/:uuid/:stepOrder?',
    name: 'guide',
    component: () => import('@/views/Guide/ViewGuide.vue')
  },
  {
    path: 'course/view/:uuid',
    name: 'guideBundle',
    component: () => import('@/views/GuideBundle/ViewBundle.vue')
  },
  {
    path: ':guideType/create',
    name: 'guideCreate',
    component: CreateGuide
  },
  {
    path: 'course/create',
    name: 'guideBundleCreate',
    component: GuideBundleCreate
  },
  {
    path: ':guideType/guide/edit/:uuid/:settingTab',
    name: 'guideEdit',
    component: EditGuide,
    props: true
  },
  {
    path: 'course/edit/:uuid',
    name: 'guideBundleEdit',
    component: GuideBundleCreate
  },
  {
    path: ':guideType/guide/submissions/:uuid',
    name: 'guideSubmissions',
    component: GuideSubmissions
  },
  {
    path: 'create/:from?',
    name: 'spaceCreate',
    component: SpaceCreate
  },

  {
    path: 'about',
    name: 'spaceAbout',
    component: SpaceAbout
  },
  {
    path: 'settings/:from?',
    name: 'spaceSettings',
    component: SpaceSettings
  },
  {
    path: 'discord-settings',
    name: 'spaceDiscord',
    props: true,
    component: SpaceDiscord
  },
  {
    path: 'dao-settings',
    name: 'spaceEdit',
    props: true,
    component: SetupSpace
  }
];

// If accessed through custom domain, mount space routes under /.
// Requests starting with /:key will be redirected.
// E.g. /balancer/proposal/:proposalId becomes /proposal/:proposalId
if (domain) {
  routes.push(
    { path: '/', name: 'home', component: Space, children: spaceRoutes },
    { path: '/delegate/:key?/:to?', name: 'delegate', component: Delegate },
    {
      path: `/${domain}`,
      alias: `/${alias ?? domain}`,
      name: 'home-redirect',
      redirect: '/'
    },
    {
      path: `/${domain}/:path(.*)`,
      alias: `/${alias ?? domain}/:path(.*)`,
      name: 'space-redirect',
      redirect: (to: RouteLocation) => ({ path: `/${to.params.path}` })
    },
    {
      path: '/generic-discord-redirect',
      name: 'genericDiscordRedirect',
      component: GenericDiscordRedirect
    }
  );
} else {
  // If accessed through localhost or snapshot.org, add all routes and
  // prefix space routes with space domain (/:key).
  routes.push(
    { path: '/', name: 'home', component: Home },
    {
      path: '/generic-discord-redirect',
      name: 'genericDiscordRedirect',
      component: GenericDiscordRedirect
    },
    { path: '/setup', name: 'setup', component: Setup },
    { path: '/setup-dao', name: 'setup-dao', component: SetupSpace },
    { path: '/networks', name: 'networks', component: Explore },
    { path: '/strategies', name: 'strategies', component: Explore },
    { path: '/plugins', name: 'plugins', component: Explore },
    { path: '/delegate/:key?/:to?', name: 'delegate', component: Delegate },
    { path: '/timeline', name: 'timeline', component: Timeline },
    { path: '/explore', name: 'explore', component: Timeline },
    { path: '/playground/:name', name: 'playground', component: Playground },
    { path: '/strategy/:name', name: 'strategy', component: Strategy },
    { path: '/:key', name: 'space', component: Space, children: spaceRoutes }
  );
}

// catch all
routes.push({
  path: '/:pathMatch(.*)*',
  name: 'error-404',
  redirect: '/'
});

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedGuide) {
    if (savedGuide) {
      return savedGuide;
    }

    if (to.params.retainScrollGuide) {
      return {};
    }

    if (to.hash) {
      const guide = { selector: to.hash };
      return { el: guide };
    }

    return { top: 0 };
  }
});

export default router;
